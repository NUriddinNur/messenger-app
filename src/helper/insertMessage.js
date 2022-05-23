
export default async function (db, data) {
    const newMess = await db.models.Message.build({
        user_from: data.userId,
        user_to: data.userTo,
        body: data.body,
    })
    await newMess.save()
}