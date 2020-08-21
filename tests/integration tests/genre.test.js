require('dotenv').config({ path: `./.env.${process.env.NODE_ENV}`});
const request = require('supertest');
const {Genre} = require('../../models/genre');
const jwt = require('jsonwebtoken');
const generateToken = require('../../helpers/generatetoken');
let server;

describe('/api/genres',() => {

    let user = {
        _id:'1',
        name:'testuser',
        roles:[{_id:1,name:'administrator'},{_id:2,name:'reviewer'}]
    };

    const token = generateToken(user);

    beforeEach(() => { server = require('../../index'); });
    afterEach( async () => { 
        await Genre.deleteMany({});
        server.close(); 
    });

    describe('GET /', () => {
        it('should be able to access GET genres', async () => {
            await Genre.collection.insertMany([
                {name:"genre1"},
                {name:"genre2"}
            ]);

            const res = await request(server).get('/api/v1/genres').set('x-auth-token',token);

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
        });
    });

    describe('GET /:id', () => {
        it('should return a genre when valid genre id is provided.', async () => {
            const genre = new Genre({name:'genre1'});
            await genre.save();

            const res = await request(server).get(`/api/v1/genres/${genre._id}`).set({'x-auth-token':token});
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name',genre.name);
        });
        it('should return 404 when invalid genre id is provided.', async () => {
            const id = 1;

            const res = await request(server).get(`/api/v1/genres/${id}`).set({'x-auth-token':token});
            expect(res.status).toBe(404);
        });
    });


    describe('POST /', () => {
        it('should be able to create a new genre when a valid genre object is provided.', async () => {
            const genre = {
                name:'genre3'
            }
            const res = await request(server)
                            .post(`/api/v1/genres`)
                            .set({'x-auth-token':token})
                            .send(genre);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name',genre.name);
        });
        it('should return 404 when invalid genre name is provided.', async () => {
            const genre = {
                name:''
            }
            const res = await request(server)
                .post(`/api/v1/genres`)
                .set({'x-auth-token':token})
                .send(genre);
            expect(res.status).toBe(400);
        });
    });


    describe('PUT /:id', () => {
        it('should be able to update genre when valid genre and genre id is provided.', async () => {
            const genre = new Genre({name:'genre1'});
            await genre.save();

            const updatedGenre = {
                _id:genre._id,
                name:'genre4'
            };

            const res = await request(server)
                            .put(`/api/v1/genres/${updatedGenre._id}`)
                            .set({'x-auth-token':token})
                            .send(updatedGenre);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name',updatedGenre.name);
        });

        it('should return 404 when invalid genre id was provided.', async () => {
            const genre = new Genre({name:'genre1'});
            await genre.save();

            const updatedGenre = {
                _id:'5f39286107ee453d000e70fa',
                name:'genre4'
            };

            const res = await request(server)
                            .put(`/api/v1/genres/${updatedGenre._id}`)
                            .set({'x-auth-token':token})
                            .send(updatedGenre);
            expect(res.status).toBe(404);
        });

        it('should return 400 when invalid name was provided.', async () => {
            const genre = new Genre({name:'genre1'});
            await genre.save();

            const updatedGenre = {
                _id:genre._id,
                name:''
            };

            const res = await request(server)
                            .put(`/api/v1/genres/${updatedGenre._id}`)
                            .set({'x-auth-token':token})
                            .send(updatedGenre);
            expect(res.status).toBe(400);
        });
        
    });

    describe('DELETE /:id', () => {
        it('should be able to delete genre when valid id is provided.', async () => {
            const genre = new Genre({name:'genre1'});
            await genre.save();

            const res = await request(server)
                            .delete(`/api/v1/genres/${genre._id}`)
                            .set({'x-auth-token':token});
            const genres = await Genre.find();
            expect(res.status).toBe(200);
            expect(genres.length).toBe(0);
        });

        it('should return 404 when invalid id was provided.', async () => {

            const invalidId = '2';

            const res = await request(server)
                            .delete(`/api/v1/genres/${invalidId}`)
                            .set({'x-auth-token':token});

            const genres = await Genre.find();
            expect(res.status).toBe(404);
        });

    });

});