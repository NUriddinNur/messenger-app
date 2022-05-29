export default async function (db, userId, status) {
    await db.models.User.update({
            logged: status
        },
        {
            where: {
                user_id: userId
            }
        }
        )
}