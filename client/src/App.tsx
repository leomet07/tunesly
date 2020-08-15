import React from "react";
import "./App.css";
import Home from "./routes/Home/Home";
import About from "./routes/About/About";
// @ts-ignore
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

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
		return (
			<Router>
				<div id="menu-nav">
					<div id="navigation-bar">
						<ul className="navbar">
							<li>
								<Link to="/">Home</Link>
							</li>
							<li>
								<Link to="/about">About</Link>
							</li>
						</ul>
					</div>
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
