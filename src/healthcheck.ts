import Node from "./models/Node";
import dgram from "dgram"

export async function broadcast_pings() {
    console.log("Send pings")
    
    var nodes: Array<Node> = await Node.scan();
    const message = Buffer.from(JSON.stringify({
        command: "ping"
    }));
    const client = dgram.createSocket('udp4');

    nodes.forEach(node => {
        client.send(message, +node.receiver_port, node.ip_addr)
    })
    client.close()
}