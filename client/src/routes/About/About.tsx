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
				<h1 className="about_subtitle">About</h1>
				<h2 id="non_profit">
					This app is not monitizable at all, with 0 profit (not for
					profit)
				</h2>
				<h3>This was built for Tech With Tim's august code jam.</h3>
				<h3>
					This is a spotify playlist/song generator, built on top of
					their extensive databases through their api.
				</h3>
				<h3>
					You may ask, was this built in one month? Yes, it was, you
					can even check the commit history on{" "}
					<a href="https://github.com/leomet07/web-music-maker">
						the project's github
					</a>
					.
				</h3>

				<h2 className="about_subtitle">Founding Reasons</h2>
				<h3>
					We had noticed that music is something everyone loves, but
					our own unique specific tastes make having a large playlist
					almost impossible, even with spotifys own "tools"
				</h3>
				<h3>
					This is a generator for highly specified and customizable
					playlists.
				</h3>
				<h2 className="about_subtitle">Underlying Technology</h2>
				<h3>
					The backend "proxy" api is built with express and nodejs (in
					the project github). The frontend is built with react and
					react-router.
				</h3>
			</div>
		);
	}
}
export default About;
