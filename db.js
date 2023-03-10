const Sequelize = require('sequelize');

//require('dotenv').config();

require('dotenv').config({ path: require('find-config')('.env') })

// Conexão com o banco de dados MySQL
const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {

        host: 'localhost',
        dialect: 'mysql'

});

module.exports = {

    Sequelize: Sequelize,
    sequelize: sequelize

}
