import { TestDatabase } from '../helpers/testDatabase';
import { v4 as uuidv4 } from 'uuid';

describe('Database Unit Tests', () => {
    let db: TestDatabase;

    beforeEach(() => {
        db = new TestDatabase(':memory:');
    });

    afterEach(async () => {
        await db.clear();
        db.close();
    });

    describe('create', () => {
        it('should create a user with all required fields', async () => {
            const userData = {
                username: 'testuser',
                email: 'test@example.com',
                name: 'Test User',
                gender: 'male',
                bio: 'Test bio'
            };

            const user = await db.create(userData);

            expect(user).toHaveProperty('id');
            expect(user.username).toBe(userData.username);
            expect(user.email).toBe(userData.email);
            expect(user.name).toBe(userData.name);
            expect(user.gender).toBe(userData.gender);
            expect(user.bio).toBe(userData.bio);
            expect(user.createdAt).toBeDefined();
        });

        it('should create a user with only required fields', async () => {
            const userData = {
                username: 'minimaluser',
                email: 'minimal@example.com',
                name: 'Minimal User'
            };

            const user = await db.create(userData);

            expect(user.id).toBeDefined();
            expect(user.username).toBe(userData.username);
            expect(user.email).toBe(userData.email);
            expect(user.name).toBe(userData.name);
        });

        it('should generate UUID for user id', async () => {
            const user = await db.create({
                username: 'uuidtest',
                email: 'uuid@example.com',
                name: 'UUID Test'
            });

            expect(user.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
        });
    });

    describe('findById', () => {
        it('should find user by id', async () => {
            const created = await db.create({
                username: 'finduser',
                email: 'find@example.com',
                name: 'Find User'
            });

            const found = await db.findById(created.id!);

            expect(found).not.toBeNull();
            expect(found?.id).toBe(created.id);
            expect(found?.username).toBe('finduser');
        });

        it('should return null for non-existent user', async () => {
            const found = await db.findById(uuidv4());
            expect(found).toBeNull();
        });
    });

    describe('findAll', () => {
        beforeEach(async () => {
            await db.create({ username: 'user1', email: 'user1@test.com', name: 'User One', gender: 'male' });
            await db.create({ username: 'user2', email: 'user2@test.com', name: 'User Two', gender: 'female' });
            await db.create({ username: 'user3', email: 'user3@test.com', name: 'User Three', gender: 'male' });
        });

        it('should return all users', async () => {
            const users = await db.findAll();
            expect(users.length).toBeGreaterThanOrEqual(3);
        });

        it('should filter by gender', async () => {
            const users = await db.findAll({ gender: 'male' });
            expect(users.every((u: any) => u.gender === 'male')).toBe(true);
        });

        it('should filter by name (partial match)', async () => {
            const users = await db.findAll({ name: 'One' });
            expect(users.some((u: any) => u.name.includes('One'))).toBe(true);
        });

        it('should filter by username (partial match)', async () => {
            const users = await db.findAll({ username: 'user1' });
            expect(users.some((u: any) => u.username.includes('user1'))).toBe(true);
        });

        it('should filter by email (partial match)', async () => {
            const users = await db.findAll({ email: 'user1' });
            expect(users.some((u: any) => u.email.includes('user1'))).toBe(true);
        });

        it('should combine multiple filters', async () => {
            const users = await db.findAll({ gender: 'male', name: 'User' });
            expect(users.every((u: any) => u.gender === 'male' && u.name.includes('User'))).toBe(true);
        });
    });

    describe('update', () => {
        it('should update user fields', async () => {
            const user = await db.create({
                username: 'updateuser',
                email: 'update@example.com',
                name: 'Original Name'
            });

            const updated = await db.update(user.id!, {
                name: 'Updated Name',
                bio: 'New bio'
            });

            expect(updated?.name).toBe('Updated Name');
            expect(updated?.bio).toBe('New bio');
            expect(updated?.updatedAt).toBeDefined();
        });

        it('should return null for non-existent user', async () => {
            const updated = await db.update(uuidv4(), { name: 'Test' });
            expect(updated).toBeNull();
        });

        it('should update only provided fields', async () => {
            const user = await db.create({
                username: 'partialupdate',
                email: 'partial@example.com',
                name: 'Original',
                bio: 'Original bio'
            });

            const updated = await db.update(user.id!, { name: 'Updated' });

            expect(updated?.name).toBe('Updated');
            expect(updated?.bio).toBe('Original bio');
        });
    });

    describe('delete', () => {
        it('should delete user by id', async () => {
            const user = await db.create({
                username: 'deleteuser',
                email: 'delete@example.com',
                name: 'Delete User'
            });

            const deleted = await db.delete(user.id!);
            expect(deleted).toBe(true);

            const found = await db.findById(user.id!);
            expect(found).toBeNull();
        });

        it('should return false for non-existent user', async () => {
            const deleted = await db.delete(uuidv4());
            expect(deleted).toBe(false);
        });
    });
});

