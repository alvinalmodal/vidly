require('dotenv').config({ path: `./.env.${process.env.NODE_ENV}`});
const {Customer} = require('../../models/customer');
const request = require('supertest');
const generateToken = require('../../helpers/generatetoken');
const { exceptions } = require('winston');
let server;

describe('/api/v1/customers', () => {

    let user = {
        _id:'1',
        name:'testuser',
        roles:[{_id:1,name:'administrator'},{_id:2,name:'reviewer'}]
    };

    let token = generateToken(user);

    beforeEach(() => { server = require('../../index'); });
    afterEach( async () => { 
        await Customer.deleteMany({});
        server.close(); 
    });

    describe('GET /', () => {
        it('should return list of customers', async () => {

            await Customer.insertMany([
                {
                    isGold:true,
                    name:'Alvin Almodal',
                    phone:'09151234567'
                },
                {
                    isGold:true,
                    name:'Pendro Penduko',
                    phone:'09151234567'
                },
            ]);

            const res = await request(server)
                                .get('/api/v1/customers')
                                .set('x-auth-token',token);
            
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            
        });
        it('should return 401 when auth token is not provided.', async () => {

            await Customer.insertMany([
                {
                    isGold:true,
                    name:'Alvin Almodal',
                    phone:'09151234567'
                },
                {
                    isGold:true,
                    name:'Pendro Penduko',
                    phone:'09151234567'
                },
            ]);

            const res = await request(server)
                                .get('/api/v1/customers');
            
            expect(res.status).toBe(401);
            
        });

        it('should return 403 when user role is not administrator.', async () => {

            user = {
                _id:'1',
                name:'testuser',
                roles:[{_id:1,name:'ordinarytestuser'},{_id:2,name:'reviewer'}]
            };
        
            token = generateToken(user);

            await Customer.insertMany([
                {
                    isGold:true,
                    name:'Alvin Almodal',
                    phone:'09151234567'
                },
                {
                    isGold:true,
                    name:'Pendro Penduko',
                    phone:'09151234567'
                },
            ]);

            const res = await request(server)
                                .get('/api/v1/customers')
                                .set('x-auth-token',token);
            
            expect(res.status).toBe(403);
            
        });
    });

    describe('GET /:id',() => {

        const exec = () => {
            const customer = new Customer({
                isGold:true,
                name:'Pendro Penduko',
                phone:'09151234567'
            });
            return customer;
        }

        it('should return 404 when provided id is invalid', async () => {
            
            const customer = exec();
            customer.save();
            const invalidId = 1;
            const res = await request(server)
                                .get(`/api/v1/customers/${invalidId}`)
                                .set('x-auth-token',token);
            
            expect(res.status).toBe(403);
        });

        it('should return 401 when auth token is not provided', async () => {
            
            const customer = exec();
            customer.save();
            const invalidId = 1;
            const res = await request(server)
                                .get(`/api/v1/customers/${invalidId}`);
            
            expect(res.status).toBe(401);
        });

        
        it('should return 403 when auth role is invalid.', async () => {
            
            const customer = exec();
            await customer.save();
            user = {
                _id:'1',
                name:'testuser',
                roles:[{_id:1,name:'invalidroletest'},{_id:2,name:'reviewer'}]
            };
            token = generateToken(user);
            const invalidId = 1;
            const res = await request(server)
                                .get(`/api/v1/customers/${invalidId}`)
                                .set('x-auth-token',token);
            
            expect(res.status).toBe(403);
        });

        it('should return 200 when valid customer is provided.', async () => {
            const customer = exec();
            await customer.save();
            user = {
                _id:'1',
                name:'testuser',
                roles:[{_id:1,name:'administrator'},{_id:2,name:'reviewer'}]
            };
            token = generateToken(user);
            const res = await request(server)
                                .get(`/api/v1/customers/${customer._id}`)
                                .set('x-auth-token',token);
            
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name','Pendro Penduko');
            expect(res.body).toHaveProperty('phone');
        });
    });

    describe('POST /', () => {

        it('should create new customer when input is invalid', async () => {
            const customer = {
                isGold:true,
                name:'Pendro Penduko',
                phone:'09151234567'
            };
            user = {
                _id:'1',
                name:'testuser',
                roles:[{_id:1,name:'administrator'},{_id:2,name:'reviewer'}]
            };
            token = generateToken(user);
            const res = await request(server)
                                .post('/api/v1/customers')
                                .set('x-auth-token',token)
                                .send(customer);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name','Pendro Penduko');                
        });

        it('should return 400 if customer object is invalid', async () => {
            const customer = {
                isGold:'',
                name:'',
                phone:''
            };
            user = {
                _id:'1',
                name:'testuser',
                roles:[{_id:1,name:'administrator'},{_id:2,name:'reviewer'}]
            };
            token = generateToken(user);
            const res = await request(server)
                                .post('/api/v1/customers')
                                .set('x-auth-token',token)
                                .send(customer);
            expect(res.status).toBe(400);
            expect(res.body.length).toBeGreaterThan(0);              
        });

        it('should return 401 if auth token is not provided', async () => {
            const customer = {
                isGold:'',
                name:'',
                phone:''
            };
            const res = await request(server)
                                .post('/api/v1/customers')
                                .send(customer);
            expect(res.status).toBe(401);           
        });

        it('should return 403 if user role is invalid.', async () => {
            const customer = {
                isGold:'',
                name:'',
                phone:''
            };
            user = {
                _id:'1',
                name:'testuser',
                roles:[{_id:1,name:'invaliduserrole'},{_id:2,name:'reviewer'}]
            };
            token = generateToken(user);
            const res = await request(server)
                                .post('/api/v1/customers')
                                .set('x-auth-token',token)
                                .send(customer);
            expect(res.status).toBe(403);        
        });
    });
});