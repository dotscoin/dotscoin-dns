import fs from 'fs';

export async function add_node(node_ip: string, node_port: string, rpc_port: string, receiver_port: string ) {

    var resp = "";

    var ex_nodes: Array<any> = await get_nodes();

    for (let i = 0; i < ex_nodes.length; i++) {
        if (ex_nodes[i].node_ip === node_ip && node_port === ex_nodes[i].node_port) {
            resp = "Node already present";
            return resp;
        }
    }

    let node = {
        "node_ip" : node_ip,
        "node_port": node_port,
        "rpc_port" : rpc_port,
        "receiver_port" : receiver_port
    };

    ex_nodes.push(node);

    fs.writeFile("nodes.json", JSON.stringify(ex_nodes), (err: any) => {
        if (err) throw err;
        resp = "node added";
        return resp;
    });
}

export async function remove_node(node_ip: string, node_port: string){

    var ex_nodes: Array<any> = await get_nodes();
    var resp = "";

    for (let i = 0; i < ex_nodes.length; i++) {
        if (ex_nodes[i].node_ip === node_ip && node_port === ex_nodes[i].node_port) {
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

export function get_nodes(): Promise<Array<any>> {
    let nodes: Array<any> = [];

    return new Promise((resolve) => {
        fs.readFile("nodes.json", function (err: any, data: any) {
            if (err) resolve([]);
            else {
                nodes = JSON.parse(data);
                resolve(nodes);
            }
        })
    })
}

