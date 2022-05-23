export default async function ({ sequelize}) {
    const User = sequelize.models.User
    const Message = sequelize.models.Message

    User.hasMany(Message, {
        foreignKey: 'user_id'
    });
    Message.belongsTo(User, {
        foreignKey: 'user_id'
    }); 
}