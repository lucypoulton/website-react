import React, {useEffect, useState} from 'react';
import {Fade, Navbar, Theme} from 'lucy-react-components';

import {Route, Switch, useLocation} from 'wouter';
import {ProjectPage} from "./pages/project";
import IndexPage from "./pages";
import {PronounsCloudPage} from "./pages/pn";

import 'lucy-react-components/dist/index.css';
import {projectDataLoad} from './environment'

function App() {
	const [theme, setTheme] = useState<"light" | "dark">("light")
	const [fade, setFade] = useState(false);
	const [location, setLocation] = useState<string | undefined>(undefined);

	const [route, setRoute] = useLocation();

	useEffect(() => {
		projectDataLoad.then(() => {
			setFade(false);
			setTimeout(() => {
				setFade(true);
				setLocation(route);
			}, 300)
		})
	}, [route])


	return (
		<Theme theme={theme}>
			<Navbar content={<span onClick={() => setRoute("/")} style={{fontWeight: "inherit"}}>Lucy Poulton</span>}
					lightswitch
					pulled={theme === "light"}
					onSwitchPull={() => setTheme(theme === "light" ? "dark" : "light")}
			/>
			<Fade fadeIn={fade}>
				<Switch location={location}>
					<Route path="/" component={IndexPage}/>
					<Route path="/pn" component={PronounsCloudPage} />
					<Route path="/:project" component={ProjectPage}/>
				</Switch>
			</Fade>
		</Theme>
	);
}

export default App;
