import { Op } from "sequelize"
import { QueryTypes, Sequelize } from "sequelize"



export default async function (db, user_from, user_to) {

    const messages = await db.query(`select * from messages where user_from = ${user_from} and user_to = ${user_to} or user_from = ${user_to} and user_to = ${user_from}`, { type: QueryTypes.SELECT })
    const [userTo] = await db.models.User.findAll({
        attributes: ['user_id', 'username', 'user_img', 'logged', 'user_updated_at', 'user_created_at',],
        where: {
            user_id: user_to
        }
    })

    return { messages, userId: user_from, userTo }
}