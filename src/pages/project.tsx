import {Link, RouteComponentProps} from "wouter";
import {environment, projectDataLoad} from "../environment";
import "./project.css";
import {useState} from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

export interface Project {
	name: string,
	repo: string,
	displayName: string
	description: string
	lastRelease?: string,
	longDescription?: string,
	links: { [key: string]: string },
	routerLinks: { [key: string]: string }
}

export function ProjectPage({params}: RouteComponentProps) {

	const [, forceUpdate] = useState(0)
	const project = environment.projects.find(p => p.name === params["project"]);


	projectDataLoad.then(() => forceUpdate(x => x++))

	if (!project) return <>
		<h1>There's nothing here.</h1>
		<h2>There's no project on the site with that name. Sorry about that.</h2>
		<Link to="/">Go home</Link>
	</>

	return <>
		<h1>{project.displayName}</h1>
		<div className="project-links">
			{Object.entries(project.links).map(link => <span key={link[0]}><a href={link[1]}>{link[0]}</a></span>)}
			{Object.entries(project.routerLinks).map(link => <span key={link[0]}><Link href={link[1]}>{link[0]}</Link></span>)}
			<span><a href={`https://github.com/${project.repo}`}>Source</a></span>
			<span><a href={`https://github.com/${project.repo}/issues`}>Issues</a></span>
		</div>
		<div className="button project-button accent"
			 onClick={() => window.open(`https://github.com/${project.repo}/releases/latest`, "_blank")}>
			<h2>Download</h2>
			<span>Version {project.lastRelease}</span>
		</div>
		<ReactMarkdown>
			{project.longDescription ?? ""}
		</ReactMarkdown>
	</>
}
