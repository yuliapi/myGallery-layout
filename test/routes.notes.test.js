process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../src/server/index');
const knex = require('../src/server/db/connection');

describe('routes : notes', () => {

    beforeEach(() => {
        return knex.migrate.rollback()
            .then(() => { return knex.migrate.latest(); })
            .then(() => { return knex.seed.run(); });
    });

    afterEach(() => {
        return knex.migrate.rollback();
    });
    describe('GET /api/v1/notes', () => {
        it('should return all notes', (done) => {
            chai.request(server)
                .get('/api/v1/notes')
                .end((err, res) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal('application/json');
                    res.body.status.should.eql('success');
                    res.body.data.length.should.eql(5);
                    res.body.data[0].should.include.keys(
                        'id', 'header', 'body', 'photo', 'created_datetime', 'updated_datetime'
                    );
                    done();
                });
        });
    });
    describe('GET/api/v1/notes/:id', () => {
        it('should respond with a single node', (done) => {
            chai.request(server)
                .get('/api/v1/notes/1')
                .end((err, res) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal('application/json');
                    res.body.status.should.eql('success');
                    res.body.data.length.should.eql(1);
                    res.body.data[0].id.should.equal(1);
                    done();
            })


        })
    })
    describe('GET /api/v1/notes?limit=#', () => {
        it('should return limited set of notes', (done) => {
            chai.request(server)
                .get('/api/v1/notes?limit=2')
                .end((err, res) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal('application/json');
                    res.body.status.should.eql('success');
                    res.body.data.length.should.eql(2);
                    res.body.data[0].should.include.keys(
                        'id', 'header', 'body', 'photo', 'created_datetime', 'updated_datetime'
                    );
                    done();
                });
        });
    });

});

