import React from "react";
import Song from "../../components/Song";
import genres from "./genres.json";
import "./Home.css";
console.log(genres);

interface AppState {
	songs: any;
	current_genre: string | null;
	current_artist: string | null;
	playlist_uri: string | undefined;
}
class Home extends React.Component<{}, AppState> {
	constructor(props: any) {
		super(props);
		// Don't call this.setState() here!
		this.state = {
			songs: [],
			current_genre: null,
			current_artist: null,
			playlist_uri: undefined,
		};
	}
	async componentDidMount() {
		console.log("Mounted");

		this.get_songs();
	}

	get_songs = async () => {
		// eslint-disable-next-line
		let uri = window.global.BASE_URL + "/api/get_songs?";
		if (this.state.current_genre) {
			uri = uri + "seed_genres=" + this.state.current_genre + "&";
		}
		if (this.state.current_artist) {
			uri = uri + "artist_name=" + this.state.current_artist + "&";
			console.log("artist  found", uri);
		}
		let res = await fetch(uri);

		res = await res.json();
		console.info(res);

		this.setState({ songs: res });
	};

	changeGenre = async (e: any) => {
		// @ts-ignore
		let genre = String(e.target.value);

		console.log("Genre chanegd", genre);

		this.setState({ current_genre: genre });
	};
	changeArtist = async (e: any) => {
		// @ts-ignore
		let artist = String(e.target.value);

		this.setState({ current_artist: artist });
	};
	export_to_playlist = async () => {
		let response = await fetch(
			window.global.BASE_URL + "/api/create_playlist_of_songs",
			{
				method: "POST",
				headers: {
					"content-type": "application/json",
				},
				body: JSON.stringify(this.state.songs),
			}
		);
		let json: any = await response.json();
		this.setState({ playlist_uri: json.external_urls.spotify });
		console.log(json.external_urls.spotify);
	};
	render() {
		const songItems = this.state.songs.map((data: any) => {
			let uri = data.external_urls.spotify;

			uri = uri.split("/");
			uri = uri[uri.length - 1];
			return (
				<div key={uri}>
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
					<div className="wrapper">
						<div id="specification">
							<form
								id="genre_select"
								className="spec_choose"
								action="#"
							>
								<h5 className="label">Choose a genre:</h5>
								<select
									onChange={this.changeGenre}
									id="genres"
									name="genres"
								>
									{options}
								</select>
								<br />
							</form>
							<div className="spec_choose" id="artist_name">
								<h5 className="label">
									Enter an artist's name
								</h5>
								<input
									onChange={this.changeArtist}
									type="text"
								></input>
							</div>
						</div>
					</div>
					<button
						className="mainbtn"
						id="generate"
						onClick={this.get_songs}
					>
						Generate Playlist!
					</button>
					<button
						className="mainbtn"
						id="export"
						onClick={this.export_to_playlist}
					>
						Export to Playlist
					</button>
					<h3>
						<a
							href={this.state.playlist_uri}
							rel="noopener noreferrer"
							target="_blank"
						>
							{this.state.playlist_uri}
						</a>
					</h3>
					<div id="songs">{songItems}</div>
				</main>
			</div>
		);
	}
}
export default Home;
