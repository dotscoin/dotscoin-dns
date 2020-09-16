import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from "../src/index"

chai.use(chaiHttp)

it('check root path', function (done) {
    chai.request(server)
        .get('/')
        .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            done();
        });
});