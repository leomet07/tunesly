import React from "react";

import "./App.css";

interface AppState {
	songs: any;
}
class App extends React.Component<{}, AppState> {
	constructor(props: any) {
		super(props);
		// Don't call this.setState() here!
		this.state = { songs: [] };
	}
	async componentDidMount() {
		console.log("Mounted");

		let res = await fetch("http://localhost:3000/api/get_songs");

		res = await res.json();
		console.log(res, typeof res);

		this.setState({ songs: res });
	}

	render() {
		const songItems = this.state.songs.map((data: any) => {
			let uri = data.external_urls.spotify;

			uri = uri.split("/");
			uri = uri[uri.length - 1];
			return (
				<div key={uri}>
					<iframe
						src={"https://open.spotify.com/embed/track/" + uri}
						width="250"
						height="75"
						loading="lazy"
					></iframe>
				</div>
			);
		});
		return (
			<div className="App">
				<h1>Epic</h1>
				<div id="songs">{songItems}</div>
			</div>
		);
	}
}
export default App;
