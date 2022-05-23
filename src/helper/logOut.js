export default async function (db, userId) {
    const user = await db.models.User.update({
        logged: false
    },{
        where: {
            user_id: userId
        }
    })
}