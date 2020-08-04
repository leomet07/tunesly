import React from "react";
import logo from "./logo.svg";
import "./App.css";
import * as Tone from "tone";
// import soundfile from "../public/music.mp3";
// const playsound = async (tSc: any) => {
// 	// create HTMLAudioElement
// 	let audio = new Audio(soundfile);

// 	if (tSc === timerStates.COMPLETE)
// 		return (
// 			// play HTMLAudioElement
// 			audio.play()
// 		);
// };

class App extends React.Component {
	componentDidMount() {}
	async play() {
		try {
			console.log("clicked");

			const player = new Tone.Player({
				url:
					"https://tonejs.github.io/audio/berklee/gurgling_theremin_1.mp3",
				loop: true,
				autostart: true,
			}).toDestination();
			//create a distortion effect
			// const distortion = new Tone.Distortion(0.4).toDestination();
			//connect a player to the distortion
			// player.connect(distortion);
			await Tone.start();
			Tone.loaded().then(() => {
				player.start(player.now() + 0.01);
			});
		} catch (err) {
			console.log(err);
		}
	}
	render() {
		return (
			<div className="App">
				<header className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<p>
						Edit <code>src/App.tsx</code> and save to reload.
					</p>
					<a
						className="App-link"
						href="https://reactjs.org"
						target="_blank"
						rel="noopener noreferrer"
					>
						Learn React
					</a>
					<button onClick={this.play}>Play</button>
					{/* <audio
						id="ad"
						controls
						src="http://streaming.tdiradio.com:8000/house.mp3"
					></audio> */}
				</header>
			</div>
		);
	}
}
export default App;
