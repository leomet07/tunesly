import React from "react";
import Song from "../../components/Song";
import genres from "./genres.json";
import "./Home.css";
console.log(genres);

interface AppState {
	songs: any;
	test: string;
}
class Home extends React.Component<{}, AppState> {
	constructor(props: any) {
		super(props);
		// Don't call this.setState() here!
		this.state = { songs: [], test: "test" };

		this.get_songs = this.get_songs.bind(this);
	}
	async componentDidMount() {
		console.log("Mounted");

		this.get_songs();
	}

	async get_songs(songs: any = "rock") {
		// eslint-disable-next-line
		const uri = window.global.BASE_URL + "/api/get_songs" + "?" + songs;
		let res = await fetch(uri);

		res = await res.json();
		console.info(res);

		this.setState({ songs: res });
	}

	changeGenre = async (e: any) => {
		e.preventDefault();

		let genre = document.getElementById("genres");
		// @ts-ignore
		genre = String(genre.value);

		console.log("Genre chanegd", genre);

		this.get_songs(genre);
	};
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

		const options = genres.map((data: string) => {
			const dataTitle = data.charAt(0).toUpperCase() + data.slice(1);
			return (
				<option key={data} value={data}>
					{dataTitle}
				</option>
			);
		});

		return (
			<div className="App">
				<main id="container">
					<h1 className="title">Playlist generator</h1>
					<form
						id="genre_select"
						action="#"
						onSubmit={this.changeGenre}
					>
						<h5 className="label">Choose a genre:</h5>
						<select id="genres" name="genres">
							{options}
						</select>
						<br />
						<input className="submit" type="submit" />
					</form>

					<div id="songs">{songItems}</div>
				</main>
			</div>
		);
	}
}
export default Home;
