const { Sequelize } = require('../db.js');
const db = require('../db.js');

const Class = require('./Class');
const Guardian = require('./Guardian');
const Payment = require('./Payment');

const Enrollment = db.sequelize.define('enrollments', {
	id: {
		type: db.Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
		allowNull: false,
		primaryKey: true
	},
	status: {
		type: db.Sequelize.ENUM('active', 'inactive'),
		defaultValue: 'active',
        allowNull: false
	},
    startdate: {
        type: db.Sequelize.DATE,
        defaultValue: Sequelize.NOW,
		allowNull: false,
    }
})

Enrollment.hasMany(Payment);

//db.sequelize.sync({force: true});

module.exports = Enrollment;
