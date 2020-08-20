// tslint:disable:no-console
import express from "express";
import fetch from "node-fetch";
import * as dotenv from "dotenv";
import { v1 as uuid } from "uuid";

dotenv.config();
// Based off of https://github.com/thelinmichael/spotify-web-api-node
// @ts-ignore
import SpotifyWebApi from "spotify-web-api-node";
// let SpotifyWebApi = require("spotify-web-api-node");
// credentials are optional
// let spotifyApi = new SpotifyWebApi({});
// credentials are optional
const spotifyApi = new SpotifyWebApi({
	clientId: process.env.clientId,
	clientSecret: process.env.clientSecret,
	redirectUri: process.env.redirectUri,
});

if (process.env.refresh_token) {
	console.log("Override token");
	spotifyApi.setAccessToken(process.env.access_token);
	spotifyApi.setRefreshToken(process.env.refresh_token);
} else {
	// Get an access token and 'save' it using a setter
	spotifyApi.clientCredentialsGrant().then(
		(data: any) => {
			// console.log("The access token is " + data.body["access_token"]);

			spotifyApi.setAccessToken(data.body.access_token);
		},
		(err: any) => {
			console.log("Something went wrong!", err);
		}
	);
}

// Get all credentials
console.log("The credentials are ", spotifyApi.getCredentials());

// const time = 5 * 60 * 1000;
const time: number = Number(process.env.TIME) || 2 * 1000;

async function refrshToken() {
	// clientId, clientSecret and refreshToken has been set on the api object previous to this call.
	spotifyApi.refreshAccessToken().then(
		(data: any) => {
			console.log(
				"The access token has been refreshed!",
				data.body.access_token
			);

			// Save the access token so that it's used in future calls
			spotifyApi.setAccessToken(data.body.access_token);
		},
		(err: any) => {
			console.log("Could not refresh access token", err);
		}
	);
}
setInterval(refrshToken, time); // 5 min

refrshToken();
export const router = express.Router();

router.get("/", (req, res) => {
	res.send("Hello world from API!");
});

function convert_uri(params: any) {
	// convert objec to a query string
	return Object.keys(params)
		.map((key) => `${key}=${params[key]}`)
		.join("&");
}
router.get("/get_songs", async (req, res) => {
	// console.log(req.query, spotifyApi.getAccessToken());
	const seedGenres = req.query.seed_genres || "acoustic";
	// Use genre as base
	const routeParams: { [key: string]: any } = {
		seed_genres: seedGenres,
	};

	if (req.query.artist_name) {
		const response: any = await fetch(
			"https://api.spotify.com/v1/search?q=" +
				req.query.artist_name +
				"&type=artist",
			{
				method: "GET",
				headers: {
					accept: "application/json",
					"content-type": "application/json",
					authorization: "Bearer " + spotifyApi.getAccessToken(),
				},
			}
		);

		const json: any = await response.json();

		const artistGenres: string[] = json.artists.items[0].genres;

		const uriArtistGenres: string = "," + artistGenres.join(",");
		routeParams.seed_genres = routeParams.seed_genres + uriArtistGenres;

		const artistId: string = json.artists.items[0].id;
		routeParams.seed_artists = artistId;
	}
	console.log(routeParams);
	const uri: string =
		"https://api.spotify.com/v1/recommendations?" +
		convert_uri(routeParams);
	console.log(uri);
	let resval: any = await fetch(uri, {
		method: "GET",
		headers: {
			accept: "application/json",
			"content-type": "application/json",
			authorization: "Bearer " + spotifyApi.getAccessToken(),
		},
	});
	resval = await resval.json();

	if ("error" in resval) {
		throw new Error(resval.error.message);
	}

	const urls = resval.tracks;
	res.send(urls);
});

router.get("/get_genres", async (req, res) => {
	try {
		const seeds = await spotifyApi.getAvailableGenreSeeds();
		res.json(seeds.body.genres);
	} catch (err) {
		res.json(err);
	}
});

router.get("/callback", async (req, res) => {
	// Retrieve an access token and a refresh token
	spotifyApi.authorizationCodeGrant(req.query.code).then(
		(data: any) => {
			console.log("The token expires in " + data.body.expires_in);
			console.log("The access token is " + data.body.access_token);
			console.log("The refresh token is " + data.body.refresh_token);

			// Set the access token on the API object to use it in later calls
			spotifyApi.setAccessToken(data.body.access_token);
			spotifyApi.setRefreshToken(data.body.refresh_token);

			return res.json({
				access_token: data.body.access_token,
				refresh_token: data.body.refresh_token,
			});
		},
		(err: any) => {
			console.log("Something went wrong!", err);
		}
	);
});

async function createPlaylist(name: string | undefined = undefined) {
	if (name == undefined) {
		name = uuid();
	}
	// Create a private playlist
	const body: any = JSON.stringify({
		name,
		description: "Tunesly generated playlist",
		public: true,
	});
	const response = await fetch(
		"https://api.spotify.com/v1/users/" + process.env.UID + "/playlists",
		{
			method: "POST",
			headers: {
				accept: "application/json",
				"content-type": "application/json",
				authorization: "Bearer " + spotifyApi.getAccessToken(),
			},
			body,
		}
	);

	const data = await response.json();

	return data;
}

async function addToPlaylist(playlistId: string, songId: string) {
	let uri =
		"https://api.spotify.com/v1/playlists/" +
		playlistId +
		"/tracks?uris=spotify:track:" +
		songId;
	let response = await fetch(uri, {
		method: "POST",
		headers: {
			accept: "application/json",
			"content-type": "application/json",
			authorization: "Bearer " + spotifyApi.getAccessToken(),
		},
	});

	let json = await response.json();
	return json;
}

function addToPlaylistAsync(playlistId: string, songId: string) {
	let uri =
		"https://api.spotify.com/v1/playlists/" +
		playlistId +
		"/tracks?uris=spotify:track:" +
		songId;
	return fetch(uri, {
		method: "POST",
		headers: {
			accept: "application/json",
			"content-type": "application/json",
			authorization: "Bearer " + spotifyApi.getAccessToken(),
		},
	});
}

router.post("/create_playlist_of_songs", async (req, res) => {
	const data = await createPlaylist();

	let body = req.body;
	if (Array.isArray(body)) {
		let requests = [];

		for (const item of body) {
			// get id
			const songId = item.id;

			requests.push(addToPlaylistAsync(data.id, songId));
		}

		await Promise.all(requests);
	}
	res.send(data);
});

router.get("/addToPlaylist", async (req, res) => {
	let playlistId = req.body.playlistId;
	let songid = req.body.songId;
	const data = await addToPlaylist(playlistId, songid);
	console.log(playlistId, songid);
	console.log(data);
});

router.get("/login", (req, res) => {
	// @ts-ignore
	const scopesstr =
		"user-read-private user-read-email playlist-modify-public playlist-modify-private";
	res.redirect(
		"https://accounts.spotify.com/authorize" +
			"?response_type=code" +
			"&client_id=" +
			process.env.clientId +
			"&scope=" +
			encodeURIComponent(scopesstr) +
			"&redirect_uri=" +
			encodeURIComponent(spotifyApi.getRedirectURI())
	);
});
