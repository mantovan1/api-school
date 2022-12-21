const { Sequelize } = require('../db.js');
const db = require('../db.js');

const Student = require('./Student');
const StudentClass = require('./StudentClass.js');

const Class = db.sequelize.define('classes', {
	id: {
		type: db.Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
		allowNull: false,
		primaryKey: true
	},
	
    weekday: {
        type: db.Sequelize.ENUM('SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'),
        allowNull: false
    },

    schedule: {
        type: db.Sequelize.TIME,
        allowNull: false
    }
},
{
    indexes: [
        {
            unique: true,
            fields: ['weekday', 'schedule']
        }
    ]
}
)

Class.hasMany(StudentClass);

//db.sequelize.sync({force: true});

module.exports = Class;
