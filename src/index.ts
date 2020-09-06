import http from "http";
import express from 'express';
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import { add_node, get_nodes } from "./dns";

const app = express()
const server = http.createServer(app)
const PORT = process.env.PORT || 8000
app.use(cors())
app.use(express.json())
app.use(compression())
app.use(helmet())

app.get("/", (req, res) => {
    return res.send({
        status: "online",
        host: req.headers.host
    })
})

app.post(`/add_node`, async (req, res) => {
    var node_ip=req.body.node_ip
    var node_port=req.body.node_port
    await add_node(node_ip+":"+node_port)
    return res.send({
        status: "Node added"
    })
})

app.get("/get_nodes", async (_, res) => {
    var nodes = await get_nodes()
    return res.send({
        nodes: nodes,
    })
})

server.listen(PORT, () => console.log(`Server started at port ${PORT}`));
