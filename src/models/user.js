import { Model, DataTypes} from 'sequelize'


export default async function ({ sequelize }) {
    class User extends Model {}

    User.init({

        user_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                len: {
                    args: [2, 50],
                    msg: 'Invalid length for username!' 
                },
            }
        },
        password:{
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    min: 4,
                    msg: 'The password must be at least four characters!' 
                },
            }
        },
        user_img: {
            type: DataTypes.STRING,
            allowNull: false
        },
        logged: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }

    }, {
        tableName: 'users',
        modelName: 'User',
        updatedAt: 'user_updated_at',
        createdAt: 'user_created_at',
        underscored: true,
        sequelize
    })
}