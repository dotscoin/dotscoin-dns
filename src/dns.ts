import fs from 'fs';

export async function add_node(node_addr: string) {


    // fs.readFile('nodes.json', 'UTF-8', async(err, data) => {
    //     if(err){

    //     }
    // })
    var resp = "";

    var ex_nodes: Array<any> = await get_nodes();

    for (let i = 0; i < ex_nodes.length; i++)
    {
        if(ex_nodes[i].addr === node_addr)
        {
            resp="Node already present";
            return resp;
        }
    }

    let node = {
        "addr" : node_addr
    };

    ex_nodes.push(node);

    fs.writeFile("nodes.json", JSON.stringify(ex_nodes), (err: any) => {
        if(err) throw err;
        resp = "node added";
        console.log("updated nodes list");
        return resp;
    });
}

export function get_nodes():Promise<Array<any>> {
    const fs = require("fs"); 

    var nodes:[] = [];
    return new Promise((resolve) => {
        fs.readFile("nodes.json", function(err: any, data:any){
            if (err) throw err;
            nodes = JSON.parse(data);
            resolve(nodes);
        })
    })
}

