// models/petition.support_tier.model.ts

import {getPool} from '../../config/db';
import {ResultSetHeader, RowDataPacket} from 'mysql2';
const getSupportTiersCount = async (petitionId: number): Promise<number> => {
    const conn = await getPool().getConnection();
    const [rows] = await conn.query('SELECT COUNT(*) as count FROM support_tier WHERE petition_id = ?', [petitionId]);
    await conn.release();
    return (rows[0] as RowDataPacket).count;
}
const addSupportTier = async (petitionId: number, title: string, description: string, cost: number): Promise<ResultSetHeader> => {
    const conn = await getPool().getConnection();
    const query = 'INSERT INTO support_tier (petition_id, title, description, cost) VALUES (?, ?, ?, ?)';
    const [result] = await conn.query(query, [petitionId, title, description, cost]);
    await conn.release();
    return result;
}
const isTitleUniqueInPetition = async (title: string, petitionId: number): Promise<boolean> => {
    const conn = await getPool().getConnection();
    const [rows] = await conn.query('SELECT COUNT(*) as count FROM support_tier WHERE title = ? AND petition_id = ?', [title, petitionId]);
    await conn.release();
    const count: number = (rows[0] as RowDataPacket).count;
    return count === 0;
}
const getSupportTierById = async (tierId: number): Promise<any> => {
    const conn = await getPool().getConnection();
    const [rows] = await conn.query('SELECT * FROM support_tier WHERE id = ?', [tierId]);
    await conn.release();
    return rows[0];
}
const hasSupporters = async (tierId: number): Promise<boolean> => {
    const conn = await getPool().getConnection();
    const [rows] = await conn.query('SELECT COUNT(*) as count FROM supporter WHERE support_tier_id = ?', [tierId]);
    await conn.release();
    const count: number = (rows[0] as RowDataPacket).count;
    return count > 0;
}
const isOnlyTierForPetition = async (tierId: number, petitionId: number): Promise<boolean> => {
    const conn = await getPool().getConnection();
    const [rows] = await conn.query('SELECT COUNT(*) as count FROM support_tier WHERE petition_id = ? AND id != ?', [petitionId, tierId]);
    await conn.release();
    const count: number = (rows[0] as RowDataPacket).count;
    return count === 0;
}
const deleteSupportTier = async (tierId: number): Promise<void> => {
    const conn = await getPool().getConnection();
    const query = 'DELETE FROM support_tier WHERE id = ?';
    await conn.query(query, [tierId]);
    await conn.release();
}
const updateSupportTier = async (tierId: number, title?: string, description?: string, cost?: number): Promise<void> => {
    const conn = await getPool().getConnection();
    let query = 'UPDATE support_tier SET';
    const params = [];
    if (title !== undefined) {
        query += ' title = ?,';
        params.push(title);
    }
    if (description !== undefined) {
        query += ' description = ?,';
        params.push(description);
    }
    if (cost !== undefined) {
        query += ' cost = ?,';
        params.push(cost);
    }
    // Remove the trailing comma if any
    if (params.length > 0) {
        query = query.slice(0, -1);
    }
    query += ' WHERE id = ?';
    params.push(tierId);

    await conn.query(query, params);
    await conn.release();
}

export { getSupportTiersCount, isTitleUniqueInPetition,
    getSupportTierById, hasSupporters, isOnlyTierForPetition,
    addSupportTier,deleteSupportTier, updateSupportTier};
