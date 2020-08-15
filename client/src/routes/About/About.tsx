import React from "react";

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
			</div>
		);
	}
}
export default About;
