import request from 'supertest';
import express, { Express } from 'express';
import routes from '../../src/routes/api';

const app: Express = express();
app.use(express.json());
app.use('/api', routes);

describe('API Integration Tests', () => {
    describe('POST /api/users', () => {
        it('should create a new user', async () => {
            const uniqueId = Date.now();
            const userData = {
                username: `newuser${uniqueId}`,
                email: `newuser${uniqueId}@example.com`,
                name: 'New User',
                gender: 'male',
                bio: 'Test bio'
            };

            const response = await request(app)
                .post('/api/users')
                .send(userData)
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body.username).toBe(userData.username);
            expect(response.body.email).toBe(userData.email);
            expect(response.body.name).toBe(userData.name);
        });

        it('should return 400 if username is missing', async () => {
            const uniqueId = Date.now();
            const response = await request(app)
                .post('/api/users')
                .send({
                    email: `test${uniqueId}@example.com`,
                    name: 'Test User'
                })
                .expect(400);

            expect(response.body.error).toContain('Username is required');
        });

        it('should return 400 if email is missing', async () => {
            const uniqueId = Date.now();
            const response = await request(app)
                .post('/api/users')
                .send({
                    username: `testuser${uniqueId}`,
                    name: 'Test User'
                })
                .expect(400);

            expect(response.body.error).toContain('Email is required');
        });

        it('should return 400 if name is missing', async () => {
            const uniqueId = Date.now();
            const response = await request(app)
                .post('/api/users')
                .send({
                    username: `testuser${uniqueId}`,
                    email: `test${uniqueId}@example.com`
                })
                .expect(400);

            expect(response.body.error).toContain('Name is required');
        });

        it('should return 409 if username already exists', async () => {
            const uniqueId = Date.now();
            await request(app)
                .post('/api/users')
                .send({
                    username: `existing${uniqueId}`,
                    email: `existing${uniqueId}@example.com`,
                    name: 'Existing User'
                })
                .expect(201);

            const response = await request(app)
                .post('/api/users')
                .send({
                    username: `existing${uniqueId}`,
                    email: `new${uniqueId}@example.com`,
                    name: 'New User'
                })
                .expect(409);

            expect(response.body.error).toContain('already exists');
        });

        it('should return 409 if email already exists', async () => {
            const uniqueId = Date.now();
            await request(app)
                .post('/api/users')
                .send({
                    username: `user1${uniqueId}`,
                    email: `existing${uniqueId}@example.com`,
                    name: 'Existing User'
                })
                .expect(201);

            const response = await request(app)
                .post('/api/users')
                .send({
                    username: `user2${uniqueId}`,
                    email: `existing${uniqueId}@example.com`,
                    name: 'New User'
                })
                .expect(409);

            expect(response.body.error).toContain('already exists');
        });
    });

    describe('GET /api/users', () => {
        it('should return all users', async () => {
            const uniqueId = Date.now();
            await request(app)
                .post('/api/users')
                .send({
                    username: `listuser1${uniqueId}`,
                    email: `list1${uniqueId}@test.com`,
                    name: 'List User 1',
                    gender: 'male'
                })
                .expect(201);

            await request(app)
                .post('/api/users')
                .send({
                    username: `listuser2${uniqueId}`,
                    email: `list2${uniqueId}@test.com`,
                    name: 'List User 2',
                    gender: 'female'
                })
                .expect(201);

            const response = await request(app)
                .get('/api/users')
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThanOrEqual(2);
        });

        it('should filter by gender', async () => {
            const uniqueId = Date.now();
            await request(app)
                .post('/api/users')
                .send({
                    username: `maleuser${uniqueId}`,
                    email: `male${uniqueId}@test.com`,
                    name: 'Male User',
                    gender: 'male'
                })
                .expect(201);

            const response = await request(app)
                .get('/api/users?gender=male')
                .expect(200);

            expect(response.body.every((u: any) => u.gender === 'male')).toBe(true);
        });

        it('should filter by name', async () => {
            const uniqueId = Date.now();
            await request(app)
                .post('/api/users')
                .send({
                    username: `nameuser${uniqueId}`,
                    email: `name${uniqueId}@test.com`,
                    name: 'Name Filter Test'
                })
                .expect(201);

            const response = await request(app)
                .get('/api/users?name=Filter')
                .expect(200);

            expect(response.body.some((u: any) => u.name.includes('Filter'))).toBe(true);
        });

        it('should filter by username', async () => {
            const uniqueId = Date.now();
            await request(app)
                .post('/api/users')
                .send({
                    username: `filteruser${uniqueId}`,
                    email: `filter${uniqueId}@test.com`,
                    name: 'Filter User'
                })
                .expect(201);

            const response = await request(app)
                .get(`/api/users?username=filteruser${uniqueId}`)
                .expect(200);

            expect(response.body.some((u: any) => u.username.includes(`filteruser${uniqueId}`))).toBe(true);
        });

        it('should filter by email', async () => {
            const uniqueId = Date.now();
            await request(app)
                .post('/api/users')
                .send({
                    username: `emailuser${uniqueId}`,
                    email: `email${uniqueId}@test.com`,
                    name: 'Email User'
                })
                .expect(201);

            const response = await request(app)
                .get(`/api/users?email=email${uniqueId}`)
                .expect(200);

            expect(response.body.some((u: any) => u.email.includes(`email${uniqueId}`))).toBe(true);
        });
    });

    describe('GET /api/users/:id', () => {
        it('should return user by id', async () => {
            const uniqueId = Date.now();
            const createResponse = await request(app)
                .post('/api/users')
                .send({
                    username: `getuser${uniqueId}`,
                    email: `get${uniqueId}@example.com`,
                    name: 'Get User'
                })
                .expect(201);

            const userId = createResponse.body.id;

            const response = await request(app)
                .get(`/api/users/${userId}`)
                .expect(200);

            expect(response.body.id).toBe(userId);
            expect(response.body.username).toBe(`getuser${uniqueId}`);
        });

        it('should return 404 for non-existent user', async () => {
            const fakeId = '00000000-0000-0000-0000-000000000000';
            const response = await request(app)
                .get(`/api/users/${fakeId}`)
                .expect(404);

            expect(response.body.error).toBe('User not found');
        });

        it('should return 400 for invalid id format', async () => {
            const response = await request(app)
                .get('/api/users/invalid-id')
                .expect(400);

            expect(response.body.error).toContain('Invalid user ID format');
        });
    });

    describe('PUT /api/users/:id', () => {
        it('should update user', async () => {
            const uniqueId = Date.now();
            const createResponse = await request(app)
                .post('/api/users')
                .send({
                    username: `updateuser${uniqueId}`,
                    email: `update${uniqueId}@example.com`,
                    name: 'Original Name'
                })
                .expect(201);

            const userId = createResponse.body.id;

            const response = await request(app)
                .put(`/api/users/${userId}`)
                .send({
                    name: 'Updated Name',
                    bio: 'Updated bio'
                })
                .expect(200);

            expect(response.body.name).toBe('Updated Name');
            expect(response.body.bio).toBe('Updated bio');
        });

        it('should return 404 for non-existent user', async () => {
            const fakeId = '00000000-0000-0000-0000-000000000000';
            const response = await request(app)
                .put(`/api/users/${fakeId}`)
                .send({ name: 'Test' })
                .expect(404);

            expect(response.body.error).toBe('User not found');
        });

        it('should return 400 for invalid id format', async () => {
            const response = await request(app)
                .put('/api/users/invalid-id')
                .send({ name: 'Test' })
                .expect(400);

            expect(response.body.error).toContain('Invalid user ID format');
        });

        it('should update only provided fields', async () => {
            const uniqueId = Date.now();
            const createResponse = await request(app)
                .post('/api/users')
                .send({
                    username: `partial${uniqueId}`,
                    email: `partial${uniqueId}@example.com`,
                    name: 'Original',
                    bio: 'Original bio'
                })
                .expect(201);

            const userId = createResponse.body.id;

            const response = await request(app)
                .put(`/api/users/${userId}`)
                .send({ name: 'Updated' })
                .expect(200);

            expect(response.body.name).toBe('Updated');
            expect(response.body.bio).toBe('Original bio');
        });
    });

    describe('DELETE /api/users/:id', () => {
        it('should delete user', async () => {
            const uniqueId = Date.now();
            const createResponse = await request(app)
                .post('/api/users')
                .send({
                    username: `deleteuser${uniqueId}`,
                    email: `delete${uniqueId}@example.com`,
                    name: 'Delete User'
                })
                .expect(201);

            const userId = createResponse.body.id;

            await request(app)
                .delete(`/api/users/${userId}`)
                .expect(204);

            await request(app)
                .get(`/api/users/${userId}`)
                .expect(404);
        });

        it('should return 404 for non-existent user', async () => {
            const fakeId = '00000000-0000-0000-0000-000000000000';
            const response = await request(app)
                .delete(`/api/users/${fakeId}`)
                .expect(404);

            expect(response.body.error).toBe('User not found');
        });

        it('should return 400 for invalid id format', async () => {
            const response = await request(app)
                .delete('/api/users/invalid-id')
                .expect(400);

            expect(response.body.error).toContain('Invalid user ID format');
        });
    });
});

