import React from "react";
import "./About.css";
interface AppState {
	songs: any;
	test: string;
}
class About extends React.Component<{}, AppState> {
	// eslint-disable-next-line
	constructor(props: any) {
		super(props);
	}

	render() {
		return (
			<div className="App">
				<h1>About</h1>
				<h3>
					This is a spotify playlist/song generator, built on top of
					their extensive databases through their api.
				</h3>
			</div>
		);
	}
}
export default About;
