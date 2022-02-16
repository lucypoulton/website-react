import {Flowbox} from "lucy-react-components";
import "./index.css";
import {environment} from "../environment";
import {useLocation} from "wouter";

export default function IndexPage() {
	const [, setLocation] = useLocation();
	return <>
		<h2>Hey! I'm Lucy.</h2>
		<div>
			<a href="https://github.com/lucypoulton">GitHub</a> | {" "}
			<a href="https://discord.lucypoulton.net">Discord</a> | {" "}
			<a href="/#"
			   onClick={() => alert(`lucy@<this domain>
Discord is my preferred method of contact - please reach out to me on there if you can!`)}>Email</a>
		</div>
		<p>I'm a teenage developer from the UK. I write silly little projects for fun. I try not to take myself too
			seriously,
			but I thoroughly enjoy spending time making my work the best it can be.</p>
		<p>I mostly work in JavaScript/TypeScript and Java, but I'm always up for learning something new. I'm a
			fan of React for web stuff.</p>
		<h2>Projects</h2>
		<span>Here's the stuff I'm working on at the moment.</span>
		<Flowbox width={20} margin={2}>
			{environment.projects.map(project =>
				<div key={project.name}
					 onClick={() => setLocation(project.name)}
					 className="button index-project">
					<h2>{project.displayName}</h2>
					<p>{project.description}</p>
				</div>)}
		</Flowbox>
	</>
}