const { Sequelize } = require('../db.js');
const db = require('../db.js');

const Payment = db.sequelize.define('payments', {
	
    hashId: {
		type: db.Sequelize.STRING,
		allowNull: false,
		primaryKey: true
	},
	amount: {
		type: db.Sequelize.DECIMAL,
		allowNull: false
	},
    date: {
        type: db.Sequelize.DATE,
        allowNull: false
    },
    status: {
        type: db.Sequelize.ENUM('pending', 'paid'),
        defaultValue: 'pending',
        allowNull: false,
    },
})

//Handler.hasOne(Student);

//db.sequelize.sync({force: true});

module.exports = Payment;