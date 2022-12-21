const { Sequelize } = require('../db.js');
const db = require('../db.js');

const Class = require('./Class');
const Guardian = require('./Guardian');
const StudentClass = require('./StudentClass.js');
const Enrollment = require('./Enrollment');

const Student = db.sequelize.define('students', {
	id: {
		type: db.Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
		allowNull: false,
		primaryKey: true
	},
	name: {
		type: db.Sequelize.STRING,
		allowNull: false
	},
    birthdate: {
        type: db.Sequelize.DATE,
        allowNull: false
    }
})

Student.hasOne(Enrollment);

Student.hasMany(StudentClass);

//db.sequelize.sync({force: true});

module.exports = Student;
