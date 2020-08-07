// tslint:disable:no-console
import express from "express";
import fetch from "node-fetch";

export const router = express.Router();

router.get("/", (req, res) => {
	res.send("Hello world from API!");
});
router.get("/get_songs", async (req, res) => {
	// let response_json = null;
	await fetch(
		"https://api.spotify.com/v1/recommendations?seed_genres=acoustic",
		{
			method: "GET",
			headers: {
				accept: "application/json",
				"content-type": "application/json",
				authorization: "Bearer " + process.env.SPOTIFY_API_KEY,
			},
		}
	)
		.then((res) => {
			return res.json();
		})
		.then((res_val) => {
			console.log(res_val);
			res.send(res_val);
		});
});
