import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

declare global {
	interface Window {
		global: any;
	}
}

window.global = window.global || {};

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
	console.log("Dev");
	window.global.BASE_URL = "http://localhost:3000";
} else {
	// production code
	console.log("Production");
	window.global.BASE_URL = "https://playlistgeneratorbackend.herokuapp.com";
}

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
