import { QueryTypes } from 'sequelize'

export default async function (db, userId, data) {
    data = data.toLowerCase()
    const users = await db.query(`SELECT u.user_id, u.username, u.user_img, u.logged, u.user_updated_at, u.user_created_at FROM users AS u WHERE LOWER(username) LIKE '%${data}%' AND logged = true AND user_id != ${userId}`, { type: QueryTypes.SELECT })
    return users
}