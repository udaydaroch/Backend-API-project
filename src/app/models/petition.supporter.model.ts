// models/petition.supporter.model.ts
import { getPool } from '../../config/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
const getAllSupportersForPetition = async (petitionId: number): Promise<any[]> => {
    const conn = await getPool().getConnection();
    const query = `
        SELECT
            s.id as supportId,
            s.support_tier_id as supportTierId,
            s.message,
            u.id as supporterId,
            u.first_name as supporterFirstName,
            u.last_name as supporterLastName,
            s.timestamp
        FROM supporter s
        JOIN user u ON s.user_id = u.id
        JOIN support_tier st ON s.support_tier_id = st.id
        WHERE s.petition_id = ?
        ORDER BY s.timestamp DESC
    `;
    const [rows] = await conn.query(query, [petitionId]);
    await conn.release();
    return rows;
}
const addSupporter = async (petitionId: number, supportTierId: number, userId: number, message: string): Promise<ResultSetHeader> => {
    const conn = await getPool().getConnection();
    const query = 'INSERT INTO supporter (petition_id, support_tier_id, user_id, message) VALUES (?, ?, ?, ?)';
    const [result] = await conn.query(query, [petitionId, userId,supportTierId, message]);
    await conn.release();
    return result;
}
const getSupportTierById = async (supportTierId: number): Promise<any> => {
    const conn = await getPool().getConnection();
    const [rows] = await conn.query('SELECT * FROM support_tier WHERE id = ?', [supportTierId]);
    await conn.release();
    return rows.length > 0 ? rows[0] : null; // Return null if no support tier found
}
const hasSupportedAtTier = async (userId: number, petitionId: number, supportTierId: number): Promise<boolean> => {
    const conn = await getPool().getConnection();
    const [rows] = await conn.query('SELECT COUNT(*) as count FROM supporter WHERE user_id = ? AND petition_id = ? AND support_tier_id = ?', [userId, petitionId, supportTierId]);
    await conn.release();
    const count: number = (rows[0] as RowDataPacket).count;
    return count > 0;
}

export {getSupportTierById,hasSupportedAtTier, getAllSupportersForPetition, addSupporter };
