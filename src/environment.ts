// this is intended to be run out of a github pages repo so recompiling every time this gets changed is not a big deal

import {Project} from "./pages/project";

export const environment : {projects: Project[]} = {
	projects: [
		{
			name: "chatchat",
			subtitle: "by HelpChat",
			displayName: "ChatChat",
			repo: "helpchat/chatchat",
			description: "Soon™",
			links: {},
			routerLinks: {}
		},
		{
			name: "pronouns",
			repo: "lucypoulton/pronouns",
			displayName: "ProNouns",
			description: "ProNouns is a Minecraft server plugin that lets players set their pronouns, which server admins can substitute into server messages.",
			links: {
				"Docs": "https://docs.lucypoulton.net/pronouns"
			},
			routerLinks: {
				"Helper": "/pnc"
			}
		},
		{
			name: "squirtgun",
			repo: "lucypoulton/squirtgun",
			displayName: "Squirtgun",
			description: "Squirtgun is a multi-purpose Java library that makes the development of cross-platform Minecraft server plugins and Discord bots easier.",
			links: {
				"Maven": "https://mvnrepository.com/search?q=squirtgun&d=net.lucypoulton",
				"Javadoc": "https://javadoc.io/doc/net.lucypoulton/squirtgun-api/"
			},
			routerLinks: {}
		}
	]
}

// this is possibly some of the worst code I have ever written.
async function fetchProjectData() {
	return Promise.all(
		environment.projects.map(async project => {
			const readmeReq = await fetch(`https://raw.githubusercontent.com/${project.repo}/master/README.md`);
			project.longDescription = await readmeReq.text();

			const versionReq = await fetch(`https://api.github.com/repos/${project.repo}/releases/latest`,
				{headers: {"accept": "application/vnd.github.v3+json"}});
			project.lastRelease = (await versionReq.json())["name"];
		})
	);
}

export const projectDataLoad = fetchProjectData();