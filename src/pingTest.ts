import { get_nodes } from "./dns";

export async function ping_test(){

    var ex_nodes: Array<any> = await get_nodes();

    for (let i = 0; i < ex_nodes.length; i++)
    {
        // Send Ping
        var PORT = 4101;
        var HOST = '127.0.0.1';

        var dgram = require('dgram');
        var message = new Buffer('Are you active?');

        var client = dgram.createSocket('udp4');
        client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
        if (err) throw err;
        console.log('UDP message sent to ' + HOST +':'+ PORT);
        client.close();
        });


        // Recieve Pong
    }
}