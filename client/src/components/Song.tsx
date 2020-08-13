import React from "react";
import "./Song.css";
interface AppState {
	songs: any;
}
class Song extends React.Component<{ song: any }, AppState> {
	async componentDidMount() {
		// console.log(this.props.song);
	}

	render() {
		const img_uri = this.props.song.album.images[1].url;
		console.log(img_uri);
		let artist_str = "By: ";

		// remove duplicates
		let set = new Set(this.props.song.artists);
		let arr = [...set];
		for (let i = 0; i < arr.length; i++) {
			if (i != 0) {
				artist_str = artist_str + ",";
			}
			let artist = this.props.song.artists[i];
			let name = artist.name;
			artist_str = artist_str + name;
		}
		return (
			<div className="song">
				<a
					className="song_name"
					target="_blank"
					rel="opener"
					href={this.props.song.external_urls.spotify}
				>
					{this.props.song.name}
				</a>
				<h5>{artist_str}</h5>

				<img src={img_uri} />
			</div>
		);
	}
}
export default Song;
