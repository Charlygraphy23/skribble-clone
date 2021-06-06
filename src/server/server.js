import express from "express";
import { connectMongo, createSocketServer } from "./config/app.config.js";
import HTTP from "http";
const app = express();
const PORT = 8080;

// cretaing HTTP server
const server = HTTP.createServer(app);

// connecting with mongo
connectMongo()
	.then(() => {
		console.log("Mongo Connected Hurrey !!");
	})
	.catch((err) => {
		console.error(err);
	});

// connection socket
createSocketServer(server);

// default api
app.get("/", (req, res) => {
	res.send("You are Lucky!!!");
});

app.use(express.json());

server.listen(PORT, () => {
	console.log("App is listening " + PORT);
});
