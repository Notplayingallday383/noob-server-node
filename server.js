import { createBareServer } from "@tomphttp/bare-server-node";
import express from "express";
import cors from "cors";
import { createServer } from "node:http";

let port = parseInt(process.env.PORT || "");
if (isNaN(port)) port = 8080;

const bare = createBareServer("/")
const app = express();

app.use(cors({
  origin: `https://localhost:${port}`,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

const server = createServer();

server.on("request", (req, res) => {
    if (bare.shouldRoute(req)) {
        bare.routeRequest(req, res);
    } else {
        app(req, res);
    }
});

server.on("upgrade", (req, socket, head) => {
    if (bare.shouldRoute(req)) {
        bare.routeUpgrade(req, socket, head);
    } else {
        socket.end();
    }
});

server.on("listening", async () => {
    const address = server.address();
    console.log("Your bare is running on:");
    console.log(`\thttp://localhost:${address.port}`);
});

server.listen({
  port,
});