import Node from "./models/Node";
import dgram from "dgram";
import { Application } from "express";

async function remove_nodes(app: Application) {
  for (let i = 0; i < app.locals.nodes.length; i++) {
    if (app.locals.blacklist.has(app.locals.nodes[i].ip_addr)) {
      app.locals.blacklist.delete(app.locals.nodes[i].ip_addr);
      await Node.remove_by_addr(app.locals.nodes[i].ip_addr);
      app.locals.nodes.splice(i, 1);
    }
  }
}

export async function broadcast_pings(app: Application) {
  console.log("Health check started");
  await remove_nodes(app);
  let nodes: Array<Node> = app.locals.nodes;
  const message = Buffer.from(
    JSON.stringify({
      command: "ping",
    })
  );
  const client = dgram.createSocket("udp4");

  nodes.forEach((node) => {
    client.send(message, +node.receiver_port, node.ip_addr);
    app.locals.blacklist.add(node.ip_addr);
  });
  client.close();
}
