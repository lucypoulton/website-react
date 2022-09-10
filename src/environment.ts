// this is intended to be run out of a github pages repo so recompiling every time this gets changed is not a big deal

import {Project} from "./pages/project";
import {Activity, githubEvents} from './components/github'

export const environment: { projects: Project[], activity: Activity[] | null } = {
	activity: null,
	projects: [
		{
			name: 'djs-slash-helper',
			repo: 'lucypoulton/djs-slash-helper',
			description: 'A small library that handles the faffy bit of setting up interaction-based command with Discord.js.'
		},
		{
			name: 'lucypoulton.net',
			repo: 'lucypoulton/website-react',
			description: `This website! It's written in React and has some cool stuff going on internally.`
		},
		{
			name: 'lucy-react-components',
			repo: 'lucypoulton/lucy-react-components',
			description: 'A set of very stylistic React components, used to write this website.'
		},
		{
			name: 'devdenbot',
			displayName: 'Developer Den Discord Bot',
			description: 'A Discord bot that I maintain.',
			repo: 'TheDeveloperDen/DevDenBot',
		},
		{
			name: 'Kyorify',
			repo: 'lucypoulton/papi-kyorify',
			description: 'A utility to convert between Minecraft rich text formats.'
		},
		{
			name: 'Really Bad Command Framework',
			repo: 'lucypoulton/really-bad-cmd-lib',
			description: `A text-based command library inspired by Minecraft's Bridagier library.`
		},
		{
			name: "ChatChat",
			subtitle: "by HelpChat",
			repo: "helpchat/chatchat",
			description: "A modern, advanced, open-source Minecraft chat plugin, developed by HelpChat.",
		},
		{
			name: 'json-doclet',
			repo: 'lucypoulton/json-doclet',
			description: 'A Javadoc doclet that outputs to JSON.'
		},
		{
			name: "pronouns",
			repo: "lucypoulton/pronouns",
			displayName: "ProNouns",
			showPage: true,
			description: "ProNouns is a Minecraft server plugin that lets players set their pronouns, which server admins can substitute into server messages.",
			links: {
				"Docs": "https://docs.lucypoulton.net/pronouns",
				"Helper": "pnc"
			}
		},
		{
			name: "squirtgun",
			repo: "lucypoulton/squirtgun",
			displayName: "Squirtgun",
			showPage: true,
			description: "Squirtgun is a multi-purpose Java library that makes the development of cross-platform Minecraft server plugins and Discord bots easier.",
			links: {
				"Maven": "https://mvnrepository.com/search?q=squirtgun&d=net.lucypoulton",
				"Javadoc": "https://javadoc.io/doc/net.lucypoulton/squirtgun-api/"
			},
		}
	]
}

async function fetchProjectInfo(project: Project) {
	const readmeReq = await fetch(`https://raw.githubusercontent.com/${project.repo}/master/README.md`);
	project.longDescription = await readmeReq.text();

	const versionReq = await fetch(`https://api.github.com/repos/${project.repo}/releases/latest`,
		{headers: {"accept": "application/vnd.github.v3+json"}});
	project.lastRelease = (await versionReq.json())["name"];
}

/*
in parallel:
 - fetch readme info and latest release for every project with showPage set
 - get latest event data
 */
async function fetchAllData() {
	return Promise.all([
			...environment.projects
				.filter(project => project.showPage)
				.map(fetchProjectInfo),

			fetch(`https://api.github.com/users/lucypoulton/events`,
				{headers: {"accept": "application/vnd.github.v3+json"}})
				.then(data => data.json())
				.then(data => environment.activity = data
					.filter((x: Activity) => githubEvents.includes(x.type))
					.slice(0, 5)
				)
		]
	);
}

export const projectDataLoad = fetchAllData();
