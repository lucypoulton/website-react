import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {projectDataLoad} from "./environment";

projectDataLoad.then(() => console.log("Loaded projects"))

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById('root')
);
