import {Flowbox} from "lucy-react-components";
import "./index.scss";
import {environment} from "../environment";
import GithubStats from '../components/github'
import {useFancyNavigate} from '../components/link'

export default function IndexPage() {
	const navigate = useFancyNavigate();
	return <>
		<div className="index-splitview">
			<div className="header-intro-thing">
				<h1>Hey! I'm Lucy.</h1>
				<div>
					<a href="https://github.com/lucypoulton">GitHub</a> | {" "}
					<a href="https://discord.lucypoulton.net">Discord</a> | {" "}
					<a href="/#"
					   onClick={() => alert("lucy@<this domain>")}>Email</a>
				</div>
				<p>I write silly little projects for fun. I try not to take myself too seriously, but I have a keen eye
					for detail and thoroughly enjoy spending time making my work the best it can be.</p>
				<p>I'm a big fan of TypeScript - I use it at work and for my own projects, alongside Express and React.
					I'm also proficient in Java. That being said, I love playing with new things and expanding my
					knowledge, and am a firm believer in using the right tool for the job.</p>
			</div>
			<GithubStats/>
		</div>
		<h2>Projects</h2>
		<span>Here's a big ol' list of stuff that I'm either working on at the moment or have done in the past.</span>
		<Flowbox width={20} margin={2}>
			{environment.projects.map(project =>
				<div key={project.name}
					 onClick={() => navigate(project.showPage ? project.name : `https://github.com/${project.repo}`)}
					 className="button index-project">
					<h2>{project.displayName ?? project.name}</h2>
					<h4>{project.repo}</h4>
					<p>{project.description}</p>
				</div>)}
		</Flowbox>
	</>
}
