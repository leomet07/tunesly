import React from "react";
import "./App.css";
import Home from "./routes/Home/Home";
import About from "./routes/About/About";
// @ts-ignore
import firebase from "./firebase";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
firebase.analytics();

interface AppState {
	songs: any;
	test: string;
}
class App extends React.Component<{}, AppState> {
	// eslint-disable-next-line
	constructor(props: any) {
		super(props);
	}

	render() {
		// eslint-disable-next-line

		return (
			<Router>
				<div id="nav">
					<span>
						<Link className="link" to="/">
							Home
						</Link>
					</span>
					&nbsp;|&nbsp;
					<span>
						<Link className="link" to="/about">
							About
						</Link>
					</span>
					<span></span>
					<span></span>
				</div>
				<Switch>
					<Route exact path="/">
						<Home />
					</Route>
					<Route path="/about">
						<About />
					</Route>
				</Switch>
			</Router>
		);
	}
}
export default App;
