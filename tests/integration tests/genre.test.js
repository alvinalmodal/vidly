const request = require('supertest');
const {Genre} = require('../../models/genre');
let server;

describe('/api/genres',() => {
    beforeEach(() => { server = require('../../index'); });
    afterEach( async () => { 
        await Genre.remove({});
        server.close(); 
    });

    describe('GET /', () => {
        it('should be able to access GET genres', async () => {
            await Genre.collection.insertMany([
                {name:"genre1"},
                {name:"genre2"}
            ]);

            const res = await request(server).get('/api/v1/genres');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
        });
    });

});