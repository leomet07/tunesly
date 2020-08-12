import React from "react";

interface AppState {
	songs: any;
}
class Song extends React.Component<{ song: any }, AppState> {
	async componentDidMount() {
		// console.log(this.props.song);
	}

	render() {
		return (
			<div className="song">
				<h4>
					Song -&gt; {this.props.song.name} by{" "}
					{this.props.song.artists[0].name}
				</h4>
			</div>
		);
	}
}
export default Song;
