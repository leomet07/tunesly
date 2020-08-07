// tslint:disable:no-console
import express from "express";
import fetch from "node-fetch";
import * as dotenv from "dotenv";

dotenv.config();
// Based off of https://github.com/thelinmichael/spotify-web-api-node

let SpotifyWebApi = require("spotify-web-api-node");



// credentials are optional
let spotifyApi = new SpotifyWebApi({
	clientId: process.env.clientId,
	clientSecret: process.env.clientSecret,
	redirectUri: process.env.redirectUri,
});

// Get an access token and 'save' it using a setter
spotifyApi.clientCredentialsGrant().then(
	function (data: any) {
		console.log("The access token is " + data.body["access_token"]);

		spotifyApi.setAccessToken(data.body["access_token"]);
		// Get all credentials
		console.log("The credentials are ", spotifyApi.getCredentials());
	},
	function (err: any) {
		console.log("Something went wrong!", err);
	}
);

export const router = express.Router();

router.get("/", (req, res) => {
	res.send("Hello world from API!");
});
router.get("/get_songs", async (req, res) => {
	// console.log(req.query);
	let seed_genres = req.query.seed_genres || "acoustic";
	let uri =
		"https://api.spotify.com/v1/recommendations?seed_genres=" + seed_genres;
	console.log(uri);

	await fetch(uri, {
		method: "GET",
		headers: {
			accept: "application/json",
			"content-type": "application/json",
			authorization: "Bearer " + spotifyApi.getAccessToken(),
		},
	})
		.then((result: any) => {
			return result.json();
		})
		.then((resval: any) => {
			let urls = resval.tracks.map(function (track: any) {
				return track.external_urls.spotify;
			});

			res.send(urls);
		});
});

router.get("/get_genres", async (req, res) => {
	await fetch(
		"https://api.spotify.com/v1/recommendations/available-genre-seeds",
		{
			method: "GET",
			headers: {
				accept: "application/json",
				"content-type": "application/json",
				authorization: "Bearer " + spotifyApi.getAccessToken(),
			},
		}
	)
		.then((response) => {
			return response.json();
		})
		.then((resval: any) => {
			return res.send(resval.genres);
		})
		.catch((err) => {
			console.error(err);
		});
});

router.get("/callback", async (req, res) => {
	// let response_json = null;
	console.log("callback recieved");
});
