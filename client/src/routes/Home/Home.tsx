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
	current_track: string | null;
	current_playlist_length: number | null;
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
			current_track: null,
			current_playlist_length: null,
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
			console.log("artist found", uri);
		}

		if (this.state.current_track) {
			uri = uri + "track_name=" + this.state.current_track + "&";
			console.log("track found", uri);
		}
		if (this.state.current_playlist_length) {
			uri =
				uri +
				"playlist_length=" +
				String(this.state.current_playlist_length) +
				"&";
			console.log("length found", uri);
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
	changeTrack = async (e: any) => {
		// @ts-ignore
		let track = String(e.target.value);

		this.setState({ current_track: track });
	};
	changePlaylistLength = async (e: any) => {
		// @ts-ignore
		let length = Number(e.target.value);
		if (length < 1) {
			length = 1;
		}
		console.log("Playlist length", length);
		this.setState({ current_playlist_length: length });
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
		const title = "Playlist generator";

		let total_playlist_length = 0;
		const songItems = this.state.songs.map((data: any) => {
			total_playlist_length += data.duration_ms;

			let uri = data.external_urls.spotify;

			uri = uri.split("/");
			uri = uri[uri.length - 1];
			return (
				<div key={uri}>
					<Song song={data}> </Song>
				</div>
			);
		});

		const playlistlength = this.state.songs.length;
		const playlistlengthelement = <h3>{playlistlength} songs long</h3>;

		const total_seconds = total_playlist_length / 1000;
		const total_length_element = (
			<h3>
				{total_seconds > 100
					? String(Math.round(total_seconds / 60)) + " minutes "
					: String(Math.round(total_seconds)) + " seconds "}
				long
			</h3>
		);
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
				<div className="leftnav">
					<h2 className="subtitle">
						Playlist Generation Specification
					</h2>
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
							<h5 className="label">Enter an artist's name</h5>
							<input
								onChange={this.changeArtist}
								type="text"
							></input>
						</div>
						<div className="spec_choose" id="artist_name">
							<h5 className="label">Enter an Track</h5>
							<input
								onChange={this.changeTrack}
								type="text"
							></input>
						</div>
						<div className="spec_choose" id="length_select">
							<h5 className="label">Enter number of songs</h5>
							<input
								onChange={this.changePlaylistLength}
								type="number"
								min="1"
							></input>
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
						Export to Spotify
					</button>
				</div>
				<div className="rightnav">
					<h2 id="info_title" className="subtitle">
						Playlist Information
					</h2>
					<div>{total_length_element}</div>
					<div>{playlistlengthelement}</div>
					<h3 className="wraptext">
						<a
							href={this.state.playlist_uri}
							rel="noopener noreferrer"
							target="_blank"
						>
							{this.state.playlist_uri ? "Link to Spotify" : ""}
						</a>
					</h3>
				</div>
				<h1 className="title_desktop">{title}</h1>

				<main id="container">
					{songItems.length > 0 ? (
						<h3 className="subtitle" id="your_playlist_title">
							Your generated playlist:
						</h3>
					) : (
						<div></div>
					)}
					<div id="songs">{songItems}</div>
				</main>
			</div>
		);
	}
}
export default Home;
