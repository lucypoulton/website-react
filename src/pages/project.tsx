import {Link, RouteComponentProps} from "wouter";
import {environment} from "./environment";
import "./project.css";
import {useMemo} from "react";
import DOMPurify from "dompurify";
import {marked} from "marked";

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

export function ProjectComponent({params}: RouteComponentProps) {

	const project = environment.projects.find(p => p.name === params["project"]);

	const mdMemo = useMemo(() => DOMPurify.sanitize(marked(project?.longDescription ?? "")), [project])

	if (!project) return <>
		<h1>There's nothing here.</h1>
		<h2>There's no project on the site with that name. Sorry about that.</h2>
		<Link to="/">Go home</Link>
	</>

	return <>
		<h1>{project.displayName}</h1>
		<div className="button project-button accent"
			 onClick={() => window.open(`https://github.com/${project.repo}/releases/latest`, "_blank")}>
			<h3>Download</h3>
			<span>Version {project.lastRelease}</span>
		</div>
		<div className="project-links">
			{Object.entries(project.links).map(link => <span key={link[0]}><a href={link[1]}>{link[0]}</a></span>)}
			{Object.entries(project.routerLinks).map(link => <span key={link[0]}><Link href={link[1]}>{link[0]}</Link></span>)}
			<span><a href={`https://github.com/${project.repo}`}>Source</a></span>
			<span><a href={`https://github.com/${project.repo}/issues`}>Issues</a></span>
		</div>
		<div dangerouslySetInnerHTML={{__html: mdMemo}} />
	</>
}
