import fs from "fs";

export default class Node {
  ip_addr: string = "";
  node_addr: string = "";
  receiver_port: string = "";
  rpc_port: string = "";

  static from_json(data: any) {
    let tmp = new Node();
    tmp.ip_addr = data.ip_addr;
    tmp.node_addr = data.node_addr;
    tmp.receiver_port = data.receiver_port;
    tmp.rpc_port = data.rpc_port;

    return tmp;
  }

  to_json() {
    return {
      node_addr: this.node_addr,
      ip_addr: this.ip_addr,
      receiver_port: this.receiver_port,
      rpc_port: this.rpc_port,
    };
  }

  async save() {
    var resp = "";

    var ex_nodes: Array<any> = await Node.scan();

    for (let i = 0; i < ex_nodes.length; i++) {
      if (ex_nodes[i].ip_addr === this.ip_addr) {
        resp = "Node already present";
        return resp;
      }
    }

    let node = this.to_json();

    ex_nodes.push(node);

    fs.writeFile("nodes.json", JSON.stringify(ex_nodes), (err: any) => {
      if (err) throw err;
      resp = "node added";
      return resp;
    });
  }

  static async scan(): Promise<Array<any>> {
    let nodes: Array<any> = [];

    return new Promise((resolve) => {
      fs.readFile("nodes.json", function (err: any, data: any) {
        if (err) resolve([]);
        else {
          nodes = JSON.parse(data);
          resolve(nodes);
        }
      });
    });
  }

  static async remove_by_addr(addr: any){
    var ex_nodes: Array<any> = await Node.scan();
    var resp = "";

    for (let i = 0; i < ex_nodes.length; i++) {
        if (ex_nodes[i].ip_addr === addr) {
            if (i > -1) {
                ex_nodes.splice(i, 1);
            }
        }
    }

    fs.writeFile("nodes.json", JSON.stringify(ex_nodes), (err: any) => {
        if (err) throw err;
        resp = "node removed";
        return resp;
    });
  }
  

  async remove() {
    var ex_nodes: Array<any> = await Node.scan();
    var resp = "";

    for (let i = 0; i < ex_nodes.length; i++) {
        if (ex_nodes[i].ip_addr === this.ip_addr) {
            if (i > -1) {
                ex_nodes.splice(i, 1);
            }
        }
    }

    fs.writeFile("nodes.json", JSON.stringify(ex_nodes), (err: any) => {
        if (err) throw err;
        resp = "node removed";
        return resp;
    });
  }

}
