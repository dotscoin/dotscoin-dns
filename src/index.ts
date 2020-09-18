require("dotenv").config()

import http from "http";
import dgram from "dgram";
import express from 'express';
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import Node from "./models/Node";
import { broadcast_pings } from "./healthcheck"

const app = express()
const server = http.createServer(app)
const PORT = process.env.PORT || 8000
const udpserver = dgram.createSocket('udp4');

app.use(cors())
app.use(express.json())
app.use(compression())
app.use(helmet())

app.get("/", (req, res) => {
    console.log(req.ip.replace("::ffff:", ""))
    return res.send({
        status: "online",
        host: req.headers.host
    })
})

app.post(`/add_node`, async (req, res) => {
    let node = Node.from_json({
        ip_addr: req.ip.replace("::ffff:", ""),
        ...req.body
    })
    await node.save()
    app.locals.nodes = await Node.scan()
    return res.send({
        status: "Node added"
    })
})

app.get("/get_nodes", async (_, res) => {
    return res.send({
        nodes: app.locals.nodes
    })
})

udpserver.on('error', (err) => {
    console.log(`server error:\n${err.stack}`);
    udpserver.close();
});

udpserver.on('message', (msg, rinfo) => {
    console.log(rinfo.address)
    console.log(msg.toString());
    app.locals.blacklist.delete(rinfo.address);
});

udpserver.on('listening', () => {
    const address = server.address();
    // @ts-ignore
    console.log(`server listening ${address?.address}:${address?.port}`);
});

setInterval(() => broadcast_pings(app), 1000 * 60 * 5)

server.listen(PORT, async () => {
    console.log(`Server started at port ${PORT}`)
    app.locals.nodes = await Node.scan()
    app.locals.blacklist = new Set()
});
udpserver.bind(6500);

export default server;