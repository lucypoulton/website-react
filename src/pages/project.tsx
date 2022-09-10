import {RouteComponentProps} from "wouter";
import Link from '../components/link';
import {environment, projectDataLoad} from "../environment";
import "./project.css";
import {useState} from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import rehypeRaw from 'rehype-raw';

export interface Project {
	name: string,
	repo: string,
	displayName?: string,
	subtitle?: string,
	description: string,
	showPage?: boolean,
	lastRelease?: string,
	longDescription?: string,
	links?: { [key: string]: string },
}

export function ProjectPage({params}: RouteComponentProps) {

	const [, forceUpdate] = useState(0)
	const project = environment.projects.find(p => p.name === params["project"]);


	projectDataLoad.then(() => forceUpdate(x => x++))

	if (!project) return <>
		<h1>There's nothing here.</h1>
		<h2>There's no project on the site with that name. Sorry about that.</h2>
		<Link href="/">Go home</Link>
	</>

	return <>
		<h1 className="project-title">{project.displayName ?? project.name}</h1>
		<h3 className="project-subtitle">{project.subtitle}</h3>
		<div className="project-links">
			{project.links && Object.entries(project.links).map(link => <span key={link[0]}><Link href={link[1]}>{link[0]}</Link></span>)}
			<span><a href={`https://github.com/${project.repo}`}>Source</a></span>
			<span><a href={`https://github.com/${project.repo}/issues`}>Issues</a></span>
		</div>
		<div className="button project-button accent"
			 onClick={() => window.open(`https://github.com/${project.repo}/releases/latest`, "_blank")}>
			{project.lastRelease ? <>
				<h2>Download</h2>
				<span>Version {project.lastRelease}</span> </> : <h2>No downloads available</h2>
			}
		</div>
		<ReactMarkdown rehypePlugins={[rehypeRaw]}>
			{project.longDescription ?? ""}
		</ReactMarkdown>
	</>
}
