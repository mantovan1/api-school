const { Sequelize } = require('../db.js');
const db = require('../db.js');

const Enrollment = require('./Enrollment');
const Payment = require('./Payment.js');
const Student = require('./Student');

const Guardian = db.sequelize.define('guardians', {
	
    id: {
		type: db.Sequelize.UUID,
        defaultValue: db.Sequelize.UUIDV4,
		allowNull: false,
		primaryKey: true
	},
	name: {
		type: db.Sequelize.STRING,
		allowNull: false
	},
    cpf: {
        type: db.Sequelize.STRING(11),
        allowNull: false,
        unique: true
    },
    cellphone: {
        type: db.Sequelize.STRING(11),
        allowNull: false,
        unique: true
    },
    cep: {
        type: db.Sequelize.STRING(8),
        allowNull: false
    },
    address: {
        type: db.Sequelize.STRING,
        allowNull: false
    },
})

Guardian.hasMany(Enrollment);

//db.sequelize.sync({force: true});

module.exports = Guardian;