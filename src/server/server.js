import express from "express";
import { createSocketServer } from "./config/app.config.js";
import HTTP from "http";
const app = express();
const PORT = 8080;

// cretaing HTTP server
const server = HTTP.createServer(app);

// connection socket
createSocketServer(server);

// default api
app.get("/", (req, res) => {
	res.send("You are Lucky!!!");
});

app.use(express.json());

server.listen(process.env.PORT || PORT, () => {});
