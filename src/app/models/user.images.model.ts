import { getPool } from '../../config/db';
import Logger from '../../config/logger';
import { ResultSetHeader } from 'mysql2';

async function findById(userId: number): Promise<any> {
    Logger.info(`Finding user by ID: ${userId}`);
    const conn = await getPool().getConnection();
    const query = 'SELECT * FROM user WHERE id = ?';
    const [rows] = await conn.query(query, [userId]);
    await conn.release();
    return rows[0];
}
async function update(userId: number, imageName: string): Promise<ResultSetHeader> {
    Logger.info(`Updating user image for ID: ${userId}`);
    const conn = await getPool().getConnection();
    const query = 'UPDATE user SET image_filename = ? WHERE id = ?';
    const [result] = await conn.query(query, [imageName, userId]);
    return result;
}

async function deleteImg(userId: number): Promise<ResultSetHeader> {
    Logger.info(`Deleting image for user ID: ${userId}`);
    const conn = await getPool().getConnection();
    const query = 'UPDATE user SET image_filename = NULL WHERE id = ?';
    const [result] = await conn.query(query, [userId]);
    await conn.release();
    return result;
}

export { findById, update, deleteImg};