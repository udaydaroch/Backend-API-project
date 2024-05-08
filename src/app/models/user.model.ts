import { getPool } from '../../config/db';
import Logger from '../../config/logger';
import { ResultSetHeader } from 'mysql2';

async function findByEmail(email: string): Promise<any> {
    Logger.info(`Finding user by email: ${email}`);
    const conn = await getPool().getConnection();
    const query = 'SELECT * FROM user WHERE email = ?';
    const [rows] = await conn.query(query, [email]);
    await conn.release();
    return rows[0];
}
async function create(userDetails: {
    email: string,
    firstName: string,
    lastName: string,
    password: string }): Promise<ResultSetHeader> {
    Logger.info("Creating a new user");
    const { email, firstName, lastName, password } = userDetails;
    const conn = await getPool().getConnection();
    const query = 'INSERT INTO user (email, first_name, last_name, password) VALUES (?, ?, ?, ?)';
    const [result] = await conn.query(query, [email, firstName, lastName, password]);
    await conn.release();
    return result;
}

async function updateToken(email: string, token: string): Promise<void> {
    Logger.info(`Updating token for user with email: ${email}`);
    const conn = await getPool().getConnection();
    const query = 'UPDATE user SET auth_token = ? WHERE email = ?';
    await conn.query(query, [token, email]);
    await conn.release();
}

async function findByAuthToken(authToken: string | string[]): Promise<any> {
    Logger.info(`Finding user by auth token: ${authToken}`);
    const conn = await getPool().getConnection();
    const query = 'SELECT * FROM user WHERE auth_token = ?';
    const [rows] = await conn.query(query, [authToken]);
    await conn.release();
    return rows[0];
}
async function findById(userId: number): Promise<any> {
    Logger.info(`Finding user by ID: ${userId}`);
    const conn = await getPool().getConnection();
    const query = 'SELECT * FROM user WHERE id = ?';
    const [rows] = await conn.query(query, [userId]);
    await conn.release();
    return rows[0];
}
async function invalidateAuthToken(authToken: string | string[]): Promise<void> {
    Logger.info(`Invalidating auth token: ${authToken}`);
    const conn = await getPool().getConnection();
    const query = 'UPDATE user SET auth_token = NULL WHERE auth_token = ?';
    await conn.query(query, [authToken]);
    await conn.release();
}
async function updateUser(userId: number, updatedDetails: {
    email?: string,
    firstName?: string,
    lastName?: string,
    password?: string
}): Promise<void> {

    const { email, firstName, lastName, password } = updatedDetails;
    const conn = await getPool().getConnection();
    let query = 'UPDATE user SET ';
    const values: any[] = [];

    if (email) {
        query += 'email = ?, ';
        values.push(email);
    }
    if (firstName) {
        query += 'first_name = ?, ';
        values.push(firstName);
    }
    if (lastName) {
        query += 'last_name = ?, ';
        values.push(lastName);
    }
    if (password) {
        query += 'password = ?, ';
        values.push(password);
    }

    query = query.slice(0, -2);
    query += ' WHERE id = ?;';
    values.push(userId);

    await conn.query(query, values);
    await conn.release();
}


export { findByEmail, create, updateToken,findByAuthToken, invalidateAuthToken, findById, updateUser};