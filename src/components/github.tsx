import React from "react";
import {environment} from '../environment';
import './github.css';
import moment from 'moment'

export interface Activity {
	type: string,
	id: number,
	repo: {
		name: string
	}
	payload: any,
	created_at: string
}

type ActivityEntry = (activity: Activity) =>
{
	title: string,
	suffix: string,
	body: React.ReactNode
} | null

export const githubEvents: ReadonlyArray<string> =
	['PushEvent', 'PullRequestEvent', 'PullRequestReviewEvent', 'IssuesEvent', 'CreateEvent', 'IssueCommentEvent'] as const

interface Commit {
	sha: string,
	message: string
}

export const titles: {[k: string]: ActivityEntry} = {
	'PushEvent': (x) => ({
		title: 'pushed',
		suffix: 'to',
		body: x.payload.commits.map((c: Commit) => <span key={c.sha}>
					<a href={commitUrl(x, c)}><code>
						{c.sha.slice(0, 7)}</code></a>: {c.message}
				</span>)
	}),
	'PullRequestEvent': activity =>
		['opened', 'edited', 'closed', 'reopened', 'assigned', 'unassigned', 'created'].includes(activity.payload.action) ? {
		title: `${activity.payload.action === 'closed' && activity.payload.pull_request.merged ? 'merged' : activity.payload.action} a pull request`,
		suffix: 'in',
		body: <span><a href={prUrl(activity)}>#{activity.payload.pull_request.number}:</a> {activity.payload.pull_request.title}</span>
	} : null,
	'PullRequestReviewEvent': activity => ({
		...titles['PullRequestEvent'](activity)!,
		title: 'reviewed a pull request'
	}),
	'IssuesEvent': activity => activity.payload.action === 'opened' ? ({
		title: `${activity.payload.action} an issue`,
		suffix: 'in',
		body: <span><a href={issueUrl(activity)}>#{activity.payload.issue.number}:</a> {activity.payload.issue.title}</span>
	}) : null,
	'CreateEvent': activity => ({
		title: `created a new ${activity.payload.ref_type}`,
		suffix: 'in',
		body: activity.payload.ref
	}),
	'IssueCommentEvent': activity => activity.payload.action === 'created' ? {
	...titles['IssuesEvent'](activity)!,
		title: 'commented on an issue'
	} : null
}


function commitUrl(activity: Activity, commit: Commit) {
	return `https://github.com/${activity.repo.name}/commit/${commit.sha}`
}

function prUrl(activity: Activity) {
	return `https://github.com/${activity.repo.name}/pull/${activity.payload.pull_request.number}`
}

function issueUrl(activity: Activity) {
	return `https://github.com/${activity.repo.name}/issues/${activity.payload.issue.number}`
}

export default function GithubStats() {

	return <div className="github-activity">
		<h3>Over on <a href="https://github.com/lucypoulton">GitHub</a>...</h3>
		{environment.activity.length === 0 ?
			<p>...oh dear. There's <i>supposed</i> to be my most recent GitHub activity here, but it looks like
			GitHub doesn't feel like sharing today. Oh well. Care to <a href="https://github.com/lucypoulton">
					take a look on the site itself?</a></p> :
			environment.activity.map(x => {
			const content = titles[x.type]?.(x);
			if (!content) return null;
			return <div key={x.id}>
				<span>
					{moment(x.created_at).fromNow()}, I <b>{content.title}</b> {content.suffix} <a href={`https://github.com/${x.repo.name}`}>{x.repo.name}</a>
					</span>
			<p>{content.body}</p>
			</div>
		})}</div>;
}