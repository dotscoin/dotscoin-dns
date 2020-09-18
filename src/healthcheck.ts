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
  const client = dgram.createSocket("udp4");

  for (let i = 0; i < nodes.length; i++) {
    await sendping(client, nodes[i].ip_addr, +nodes[i].receiver_port);
    app.locals.blacklist.add(nodes[i].ip_addr);
  }

  client.close();
}

async function sendping(client: dgram.Socket, ip_addr: string, receiver_port: number) {
  const message = Buffer.from(
    JSON.stringify({
      command: "ping",
      body: {}
    })
  );

  return new Promise((resolve) => {
    client.send(message, receiver_port, ip_addr, function () {
      resolve();
    });
  })
}
