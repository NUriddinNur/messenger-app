import { Sequelize } from 'sequelize'

export default async function (db, data) {
    data = data.toLowerCase()
    const users = await db.models.User.findAll({
        attributes: ['user_id', 'username', 'user_img', 'logged', 'user_updated_at', 'user_created_at', ],
        where: {
            username: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('username')), 'LIKE', '%' + data + '%'),
        }
    })
    return users
}


