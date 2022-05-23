
export default async function (db) {
    const users = await db.models.User.findAll({
        attributes: ['user_id', 'username', 'user_img', 'logged', 'user_updated_at', 'user_created_at', ]
    })
    return users
}