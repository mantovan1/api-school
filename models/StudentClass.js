const db = require("../db");

const StudentClass = db.sequelize.define('studentclasses', {
    id: {
        type: db.Sequelize.UUID,
        defaultValue: db.Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
    }
})

//db.sequelize.sync({force: true});

module.exports = StudentClass;
