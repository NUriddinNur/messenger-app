import { Model, DataTypes} from 'sequelize'


export default async function ({ sequelize }) {
    class Message extends Model {}

    Message.init({

        message_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        user_from: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        user_to:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        body: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'messages',
        modelName: 'Message',
        updatedAt: 'message_updated_at',
        createdAt: 'message_created_at',
        underscored: true,
        sequelize
    })
}