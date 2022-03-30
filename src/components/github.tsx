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
	['PushEvent', 'PullRequestEvent', 'PullRequestReviewEvent', 'IssuesEvent'] as const

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
	'PullRequestEvent': activity => ({
		title: 'opened a pull request',
		suffix: 'in',
		body: <span><a href={prUrl(activity)}>#{activity.payload.pull_request.number}:</a> {activity.payload.pull_request.title}</span>
	}),
	'PullRequestReviewEvent': activity => ({
		...titles['PullRequestEvent'](activity)!,
		title: 'reviewed a pull request'
	}),
	'IssuesEvent': activity => activity.payload.action === 'opened' ? ({
		title: 'opened an issue',
		suffix: 'in',
		body: <span><a href={issueUrl(activity)}>#{activity.payload.issue.number}:</a> {activity.payload.issue.title}</span>
	}) : null
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
		{environment.activity.map(x => {
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