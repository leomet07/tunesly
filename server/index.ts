// tslint:disable:no-console
import express from "express";
import * as dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import { router } from "./api/index";
dotenv.config();

const app = express();

app.use(helmet());
app.use(morgan("tiny"));

app.get("/", (req, res) => {
	res.send("Hello world from ts!");
});

app.use("/api", router);

const port = process.env.PORT || 3000;

// Start the Express server
app.listen(port, () => {
	console.log(`Server started at http://localhost:${port}`);
});
