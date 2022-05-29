import { QueryTypes, Sequelize } from "sequelize"

export default async function (db, userId) {
    const comunicateUsers = await db.query(`
    select 
        DISTINCT u.username,
            u.user_id,
            u.user_img,
            logged,
            user_updated_at,
            user_created_at
    from (
            select 
                m.user_from,
                m.user_to
            from
                messages as m
            where
                user_from = ${userId} or user_to = ${userId}
        ) as m 
        inner join users as u on u.user_id = m.user_from or u.user_id = m.user_to
    `, { type: QueryTypes.SELECT })
    return comunicateUsers
}