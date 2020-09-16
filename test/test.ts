import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from "../src/index"
import dgram from "dgram"

chai.use(chaiHttp)

it('check root path', function (done) {
    chai.request(server)
        .get('/')
        .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.be.json;
            done();
        });
});

it("check add node", function (done) {
    chai.request(server)
        .post('/add_node')
        .set('Content-Type', 'application/json')
        .send({
            ip_addr: "127.0.0.1",
            node_addr: "asadadkdhhfhfffhikh",
            receiver_port: "6500",
            rpc_port: "4000",
            storage_port: "5001"
        }).end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            done();
         });
})

it("check udp message", function (done) {
    const message = Buffer.from(JSON.stringify({
        prev_command: "ping",
        body: "pong"
    }));

    const client = dgram.createSocket('udp4');
    client.connect(6500, 'localhost', () => {
        client.send(message, (err) => {
            client.close();
            done();
        });
    });
})