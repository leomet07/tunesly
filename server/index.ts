// tslint:disable:no-console
import express from "express";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();

app.get("/", (req, res) => {
	res.send("Hello world from ts!");
});

const port = process.env.PORT || 3000;

// start the Express server
app.listen(port, () => {
	console.log(`Server started at http://localhost:${port}`);
});
