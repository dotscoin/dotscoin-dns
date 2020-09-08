import { get_nodes, remove_node } from "./dns";

export function a() {setInterval(async function(){

    console.log("running")
    var ex_nodes: Array<any> = await get_nodes();

    for (let i = 0; i < ex_nodes.length; i++)
    {
        // Send Ping
        var PORT = ex_nodes[i].node_port;
        var HOST = ex_nodes[i].node_ip;

        var dgram = require('dgram');
        var message = new Buffer('Are you active?');

        var client = dgram.createSocket('udp4');
        client.send(message, 0, message.length, PORT, HOST, function(err: any) {
        if (err) throw err;
        console.log('UDP message sent to ' + HOST +':'+ PORT);
        client.close();
        });


        // Recieve Pong
        var rPORT = 3333;//port of dns
        var rHOST = '127.0.0.1';//host of dns

        var dgram = require('dgram');
        var server = dgram.createSocket('udp4');

        server.on('listening', function() {
        var address = server.address();
        console.log('UDP Server listening on ' + address.address + ':' + address.port);
        });

        server.on('message', function(message: any, remote: any) {
        console.log(remote.address + ':' + remote.port +' - ' + message);
        if (message === "yes"){}
        else{ 
            remove_node(remote.address, remote.port);
        }
            
        });
        server.bind(rPORT, rHOST);
    }

}, 1000);
}