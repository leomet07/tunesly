import React from "react";
import Song from "./components/Song";
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

		let res = await fetch(window.global.BASE_URL + "/api/get_songs");

		res = await res.json();
		console.info(res);

		this.setState({ songs: res });
	}

	render() {
		const songItems = this.state.songs.map((data: any) => {
			let uri = data.external_urls.spotify;

			uri = uri.split("/");
			uri = uri[uri.length - 1];
			return (
				<div key={uri}>
					{/* <iframe
						src={"https://open.spotify.com/embed/track/" + uri}
						width="250"
						height="75"
						loading="lazy"
					></iframe> */}
					<Song song={data}> </Song>
				</div>
			);
		});

		return (
			<div className="App">
				<h1>Playlist generator</h1>
				<div id="songs">{songItems}</div>
			</div>
		);
	}
}
export default App;
