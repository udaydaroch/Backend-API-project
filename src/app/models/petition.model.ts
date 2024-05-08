import Logger from '../../config/logger';
import { getPool } from '../../config/db';
interface PetitionQuery {
    startIndex: number;
    count: number;
    q: string;
    categoryIds: number[] | number;
    supportingCost: number;
    ownerId: number;
    supporterId: number;
    sortBy: string;
}
async function viewAllPetitions(petition: PetitionQuery): Promise<{ petitions: any[], count: number }> {
    const pool = await getPool().getConnection();

    // Base SQL for both count and select queries
    let baseSql = `
        FROM petition p
        JOIN user u ON p.owner_id = u.id
        LEFT JOIN support_tier st ON p.id = st.petition_id
        LEFT JOIN supporter s ON p.id = s.petition_id
        WHERE 1=1
        `;

    // Adding conditions
    const conditions = [];
    const values = [];

    if (petition.q) {
        conditions.push(`(p.title LIKE ? OR p.description LIKE ?)`);
        values.push(`%${petition.q}%`, `%${petition.q}%`);
    }

    if (petition.categoryIds) {
        if (Array.isArray(petition.categoryIds)) {
            conditions.push(`p.category_id IN (${petition.categoryIds.map(() => '?').join(',')})`);
            values.push(...petition.categoryIds);
        } else {
            conditions.push(`p.category_id = ?`);
            values.push(petition.categoryIds);
        }
    }

    if (petition.supportingCost) {
        conditions.push(`st.cost <= ?`);
        values.push(Number(petition.supportingCost));
    }

    if (petition.ownerId) {
        conditions.push(`p.owner_id = ?`);
        values.push(Number(petition.ownerId));
    }

    if (petition.supporterId) {
        conditions.push(`s.user_id = ?`);
        values.push(petition.supporterId);
    }

    if (conditions.length > 0) {
        baseSql += ` AND ${conditions.join(' AND ')}`;
    }


    const countSql = `SELECT COUNT(DISTINCT p.id) AS total ${baseSql}`;
    const [countResult] = await pool.query(countSql, values);
    const total = countResult[0].total;

    let selectSql = `
        SELECT DISTINCT
            p.id AS petitionId,
            p.title,
            p.category_id AS categoryId,
            p.creation_date AS creationDate,
            p.owner_id AS ownerId,
            u.first_name AS ownerFirstName,
            u.last_name AS ownerLastName,
            (SELECT COUNT(DISTINCT s.id) FROM supporter s WHERE s.petition_id = p.id) AS numberOfSupporters,
            (SELECT MIN(cost) FROM support_tier WHERE petition_id = p.id) AS supportingCost
        ${baseSql}`;

    let orderBy = 'ORDER BY p.creation_date ASC, p.id ASC'; // Default
    switch (petition.sortBy) {
        case 'ALPHABETICAL_ASC':
            orderBy = 'ORDER BY p.title ASC, p.id ASC';
            break;
        case 'ALPHABETICAL_DESC':
            orderBy = 'ORDER BY p.title DESC, p.id ASC';
            break;
        case 'COST_ASC':
            orderBy = 'ORDER BY supportingCost ASC, p.id ASC';
            break;
        case 'COST_DESC':
            orderBy = 'ORDER BY supportingCost DESC, p.id ASC';
            break;
        case 'CREATED_ASC':
            orderBy = 'ORDER BY p.creation_date ASC, p.id ASC';
            break;
        case 'CREATED_DESC':
            orderBy = 'ORDER BY p.creation_date DESC, p.id ASC';
            break;
        default:
            orderBy = 'ORDER BY creationDate ASC, p.id ASC';
            break;
    }
    selectSql += ` ${orderBy}`;


    if (petition.count) {
        selectSql += ' LIMIT ?';
        values.push(Math.max(Number(petition.count), 0));
    }
    if (petition.startIndex) {
        const offset = Math.max(0, Number(petition.startIndex) - 1);
        selectSql += ' OFFSET ?';
        values.push(offset);
    }

    const [petitionResults] = await pool.query(selectSql, values);
    await pool.release();

    return { petitions: petitionResults, count: total };
}
async function categoryExists(categoryId: number): Promise<boolean> {
    const pool = await getPool().getConnection();
    const [results, _] = await pool.query('SELECT COUNT(*) as count FROM category WHERE id = ?', [categoryId]);
    const count = results[0].count;
    await pool.release();
    return count > 0; // Returns true if category exists, false otherwise
}
async function isTitleUnique(title: string): Promise<boolean> {
    const pool = await getPool().getConnection()
    const [results, _] = await pool.query('SELECT COUNT(*) as count FROM petition WHERE title = ?', [title]);
    const count = results[0].count;
    await pool.release();
    return count === 0; // Returns true if title is unique, false otherwise
}
interface SupportTier {
    title: string;
    description: string;
    cost: number;
}
async function createPetition(title: string, description: string, categoryId: number, supportTiers: SupportTier[], ownerId: number): Promise<number> {
    let pool = await getPool().getConnection();
    const query = 'INSERT INTO petition (title, description, creation_date, owner_id, category_id) VALUES (?, ?, NOW(), ?, ?)';
    const [result] = await pool.query(query, [title, description, ownerId, categoryId]);
    await pool.release();
    pool = await getPool().getConnection();
    const petitionId = result.insertId;
    for (const tier of supportTiers) {
        await pool.query('INSERT INTO support_tier (petition_id, title, description, cost) VALUES (?, ?, ?, ?)', [petitionId, tier.title, tier.description, tier.cost]);
    }
    Logger.info(petitionId);
    return petitionId;
}
async function getPetitionById(petitionId: number): Promise<any> {
    const pool = await getPool().getConnection();
    const query = `
        SELECT
            p.id AS petitionId,
            p.title,
            p.category_id AS categoryId,
            p.owner_id AS ownerId,
            u.first_name AS ownerFirstName,
            u.last_name AS ownerLastName,
            COUNT(DISTINCT s.id) AS numberOfSupporters,
            p.creation_date AS creationDate,
            p.description,
            (SELECT SUM(st.cost) FROM supporter s,support_tier st
            WHERE s.petition_id = ? AND s.petition_id = st.petition_id AND s.support_tier_id = st.id) AS moneyRaised

        FROM
            petition p
        JOIN
            user u ON p.owner_id = u.id
        LEFT JOIN
            supporter s ON p.id = s.petition_id
        LEFT JOIN
            support_tier st ON p.id = st.petition_id
        WHERE
            p.id = ?;
    `;
    const [results] = await pool.query(query, [petitionId,petitionId]);
    await pool.release();

    const petitionData = results[0];

    Logger.info(petitionData);
    // Fetch support tiers for the petition
    const supportTierQuery = `
        SELECT
            title,
            description,
            cost,
            id AS supportTierId
        FROM
            support_tier
        WHERE
            petition_id = ?;
    `;
    const [supportTiers] = await pool.query(supportTierQuery, [petitionId]);
    Logger.info(supportTiers);
    await pool.release();
    petitionData.moneyRaised = Number(petitionData.moneyRaised);
    petitionData.supportTiers = supportTiers;
    return petitionData;
}
async function userExists(userId: number): Promise<boolean> {
    const pool = await getPool().getConnection();
    const [results, _] = await pool.query('SELECT COUNT(*) as count FROM user WHERE id = ?', [userId]);
    const count = results[0].count;
    await pool.release();
    return count > 0; // Returns true if user exists, false otherwise
}
async function isOwnerOfPetition(userId: number, petitionId: number): Promise<boolean> {
    const pool = await getPool().getConnection();
    const [result] = await pool.query('SELECT owner_id FROM petition WHERE id = ? and owner_id = ?', [petitionId, userId]);
    await pool.release();
    return result[0];
}
async function petitionExists(petitionId: number): Promise<boolean> {
    const pool = await getPool().getConnection();
    const [result] = await pool.query('SELECT COUNT(*) as count FROM petition WHERE id = ?', [petitionId]);
    await pool.release();
    return result[0].count > 0;
}
async function updatePetition(title: string, description: string, categoryId: number, petitionId: number) {
    const pool = await getPool().getConnection();
    let updateQuery = `UPDATE petition SET `;
    const updateValues = [];
    if (title) {
        updateQuery += `title = ?, `;
        updateValues.push(title);
    }
    if (description) {
        updateQuery += `description = ?, `;
        updateValues.push(description);
    }
    if (categoryId !== undefined && !isNaN(categoryId)) {
        updateQuery += `category_id = ?, `;
        updateValues.push(categoryId);
    }
    updateQuery = updateQuery.slice(0, -2);
    updateQuery += ` WHERE id = ?`;
    updateValues.push(petitionId);
    await pool.query(updateQuery, updateValues);
    await pool.release();
}
async function deletePetition(petitionId: number): Promise<void> {
    const pool = await getPool().getConnection();
    await pool.query('DELETE FROM petition WHERE id = ?', [petitionId]);
    await pool.release();
}
async function getAllCategories(): Promise<{ categoryId: number, name: string }[]> {
    const pool = await getPool().getConnection();
    const [results] = await pool.query('SELECT id AS categoryId, name FROM category');
    await pool.release();
    return results;
}
async function getPetition(petitionId: number): Promise<any> {
    const pool = await getPool().getConnection();
    const query = 'SELECT * FROM petition WHERE id = ?';
    const [results] = await pool.query(query, [petitionId]);
    await pool.release();

    if (results.length === 0) {
        return null; // No petition found with the given ID
    }
    return results[0]; // Return the found petition
}
async function updatePetitionImage(petitionId: number, imageFilename: string): Promise<void> {
    const pool = await getPool().getConnection();
    const updateQuery = `UPDATE petition SET image_filename = ? WHERE id = ?`;
    await pool.query(updateQuery, [imageFilename, petitionId]);
    Logger.info(`Updated petition ${petitionId} with new image filename: ${imageFilename}`);
    await pool.release();
}
async function categoriesExist(categoryIds: number[]): Promise<boolean> {
    const pool = await getPool().getConnection();
    const query = `SELECT id FROM category WHERE id IN (${categoryIds})`;
    const [results] = await pool.query(query, categoryIds);
    await pool.release();
    return results.length === categoryIds.length;
}

export {categoriesExist,getAllCategories, deletePetition,updatePetition,petitionExists,
    isOwnerOfPetition, userExists, createPetition,
    getPetitionById, isTitleUnique, categoryExists,
    viewAllPetitions,getPetition,updatePetitionImage};


