import sqlite3 from 'sqlite3';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../types/User';

export class Database {
    private db: sqlite3.Database;
    private initialized: Promise<void>;

    constructor() {
        this.db = new sqlite3.Database('./database.sqlite');
        this.initialized = this.init();
    }

    private init(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.run(`
                CREATE TABLE IF NOT EXISTS users (
                    id TEXT PRIMARY KEY,
                    username TEXT NOT NULL UNIQUE,
                    email TEXT NOT NULL UNIQUE,
                    name TEXT NOT NULL,
                    gender TEXT,
                    bio TEXT,
                    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }

    private async ensureInitialized(): Promise<void> {
        await this.initialized;
    }

    private run(sql: string, params: any[] = []): Promise<sqlite3.RunResult> {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function (err) {
                if (err) reject(err);
                else resolve(this);
            });
        });
    }

    private get(sql: string, params: any[] = []): Promise<User | undefined> {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, row) => {
                if (err) reject(err);
                else resolve(row as User | undefined);
            });
        });
    }

    private all(sql: string, params: any[] = []): Promise<User[]> {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows as User[]);
            });
        });
    }

    async create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
        await this.ensureInitialized();

        const id = uuidv4();
        await this.run(
            'INSERT INTO users (id, username, email, name, gender, bio) VALUES (?, ?, ?, ?, ?, ?)',
            [id, user.username, user.email, user.name, user.gender || null, user.bio || null]
        );

        const result = await this.get('SELECT * FROM users WHERE id = ?', [id]);
        if (!result) {
            throw new Error('Failed to retrieve created user');
        }
        return result;
    }

    async findAll(filters?: { username?: string; email?: string; name?: string; gender?: string }): Promise<User[]> {
        await this.ensureInitialized();

        let query = 'SELECT * FROM users WHERE 1=1';
        const params: any[] = [];

        if (filters?.username) {
            query += ' AND username LIKE ?';
            params.push(`%${filters.username}%`);
        }

        if (filters?.email) {
            query += ' AND email LIKE ?';
            params.push(`%${filters.email}%`);
        }

        if (filters?.name) {
            query += ' AND name LIKE ?';
            params.push(`%${filters.name}%`);
        }

        if (filters?.gender) {
            query += ' AND gender = ?';
            params.push(filters.gender);
        }

        query += ' ORDER BY createdAt DESC';

        return await this.all(query, params);
    }

    async findById(id: string): Promise<User | null> {
        await this.ensureInitialized();
        const result = await this.get('SELECT * FROM users WHERE id = ?', [id]);
        return result || null;
    }

    async update(id: string, updates: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User | null> {
        await this.ensureInitialized();

        const fields: string[] = [];
        const values: any[] = [];

        if (updates.username !== undefined) {
            fields.push('username = ?');
            values.push(updates.username);
        }
        if (updates.email !== undefined) {
            fields.push('email = ?');
            values.push(updates.email);
        }
        if (updates.name !== undefined) {
            fields.push('name = ?');
            values.push(updates.name);
        }
        if (updates.gender !== undefined) {
            fields.push('gender = ?');
            values.push(updates.gender);
        }
        if (updates.bio !== undefined) {
            fields.push('bio = ?');
            values.push(updates.bio);
        }

        if (fields.length === 0) {
            return await this.findById(id);
        }

        fields.push('updatedAt = CURRENT_TIMESTAMP');
        values.push(id);

        await this.run(
            `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
            values
        );

        return await this.findById(id);
    }

    async delete(id: string): Promise<boolean> {
        await this.ensureInitialized();
        const result = await this.run('DELETE FROM users WHERE id = ?', [id]);
        return result.changes > 0;
    }

    close(): void {
        this.db.close();
    }
}

export const database = new Database();
