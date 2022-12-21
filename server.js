const bodyParser = require('body-parser');
const crypto = require('crypto');
const express = require('express');
const { Sequelize } = require('./db.js');
const schedule = require('node-schedule');
const { v4: uuidv4 } = require('uuid');



const Class = require('./models/Class');
const Enrollment = require('./models/Enrollment');
const Guardian = require('./models/Guardian');
const Payment = require('./models/Payment');
const Student = require('./models/Student');
const StudentClass = require('./models/StudentClass');

/*function toTimestamp(strDate){
	var datum = Date.parse(strDate);
	return datum/1000;
}*/

function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

//eventos de geração de pagamentos

const j1 = schedule.scheduleJob({day: 30, hour: 00, minute: 00}, async () => {
	const students = await Student.findAll();

	students.map( async (e) => {
		const studentId = e.dataValues.id;

		const studentClasses = await StudentClass.findAll( {where: {studentId: studentId} } );
		const enrollment = await Enrollment.findOne( {where: { studentId: studentId }} );

		//aqui vamos preparar o terreno para criar o pagamento

		const amount = studentClasses.length * 80.00;
		const date = new Date();
		date.setHours(0, 0, 0);
		const status = 'pending';
		const enrollmentId = enrollment.dataValues.id;

		const hashId = crypto.createHash('sha256').update(amount + date + status + enrollmentId).digest('hex');

		await Payment.create({
			hashId: hashId,
			amount: amount,
			date: date,
			status: status,
			enrollmentId: enrollmentId
		})
		.catch(function(err) {
			console.log(err);
		});

	});
});

const j2 = schedule.scheduleJob({day: 30, hour: 12, minute: 00}, async () => {
	const students = await Student.findAll();

	students.map( async (e) => {
		const studentId = e.dataValues.id;

		const studentClasses = await StudentClass.findAll( {where: {studentId: studentId} } );
		const enrollment = await Enrollment.findOne( {where: { studentId: studentId }} );

		//aqui vamos preparar o terreno para criar o pagamento

		const amount = studentClasses.length * 80.00;
		const date = new Date();
		date.setHours(0, 0, 0);
		const status = 'pending';
		const enrollmentId = enrollment.dataValues.id;

		const hashId = crypto.createHash('sha256').update(amount + date + status + enrollmentId).digest('hex');

		await Payment.create({
			hashId: hashId,
			amount: amount,
			date: date,
			status: status,
			enrollmentId: enrollmentId
		})
		.catch(function(err) {
			console.log(err);
		});

	});

});

//

const app = express();
app.use(bodyParser.json());

app.get('/', async (req, res) => {
	res.json({api_version: '1.0'})
});

//rota para alunos que são maiores de idade

app.post('/student/r/registration', async (req, res) => {

	//neste caso iremos criar uma inserção na tabela estudante e outra na tabela guardião/responsável

	//esta é a parte referente ao estudante

	const studentName = req.body.studentName;
	const studentBirthdate = req.body.studentBirthdate;

	//esta é a parte referente ao guardião
	//nesse caso os dados se repetiram nas colunas nome pois o guardião da pessoa é ela mesma.

	const cpf = req.body.cpf;
	const cellphone = req.body.cellphone;
	const cep = req.body.cep;
	const address = req.body.address;

	//aqui esta o id da classe que a pessoa deseja se inscrever, este dado é um array
	// e deve ser tratado como tal, pois a pessoa pode escolher fazer mais de uma
	// aula semanal

	const classIds = req.body.classIds;

	//aqui vai ser calculada a idade da pessoa com base na data de nascimento e na data atual

	const age = getAge(studentBirthdate);

	if(age < 18) {
	
		res.json({message: 'Este estudante possui menos de 18 anos, o cadastro deve ser feito por outra rota', rota_correta: 'http://192.168.15.152:8080/student/m/registration'});
		res.status(200);
	
	}

	//verifica se a variável classIds é um array
	
	else if(!Array.isArray(classIds)) {
		res.json({message: 'Envio incorreto de variáveis'});
		res.status(200);
	}

	else {

		await Guardian.create({
			name: studentName,
			cpf: cpf,
			cellphone: cellphone,
			cep: cep,
			address: address
		})
		.then( async function(guardian) {

			await Student.create({
				name: studentName,
				birthdate: studentBirthdate
			})
			.then( async function(student) {

				//console.log(student);

				await Enrollment.create({
					guardianId: guardian.id,
					studentId:  student.id,
					status: 'active'
				})
				.then( async function() {

					//console.log(classIds);

					await classIds.map( async (e) => {
						const result = await Class.findOne( { where: {id: e} } );

						//console.log(result);

						if(result) {
							StudentClass.create({
								studentId: student.id,
								classId: e
							})
						}
					})

					res.json({message: 'all occurred successfully'});
					res.status(201);

				})
				.catch(function(err) {
					res.json({message: err});
				});


			})
			.catch(function(err) {
				res.json({message: err});
			})
		})
		.catch(function(err) {
			res.json({message: err});
		})

	}	

})

//rota para alunos que são menores de idade ou não são responsáveis por si.

app.post('/student/m/registration', async(req, res) => {

	//neste caso iremos criar uma inserção na tabela estudante e outra na tabela guardião/responsável

	//esta é a parte referente ao estudante

	const studentName = req.body.studentName;
	const studentBirthdate = req.body.studentBirthdate;

	//esta é a parte referente ao guardião
	
	const guardianName = req.body.guardianName;
	const guardianCPF = req.body.guardianCPF;
	const guardianCellphone = req.body.guardianCellphone;
	const guardianCep = req.body.guardianCep;
	const guardianAddress = req.body.guardianAddress;

	//aqui esta o id da classe que a pessoa deseja se inscrever, este dado é um array
	// e deve ser tratado como tal, pois a pessoa pode escolher fazer mais de uma
	// aula semanal

	const classIds = req.body.classIds;


	if(!Array.isArray(classIds)) {
		res.json({message: 'Envio incorreto de variáveis'});
		res.status(200);
	}

	else {

		await Guardian.create({
			name: guardianName,
			cpf: guardianCPF,
			cellphone: guardianCellphone,
			cep: guardianCep,
			address: guardianAddress
		})
		.then( async function(guardian) {

			await Student.create({
				name: studentName,
				birthdate: studentBirthdate
			})
			.then( async function(student) {

				//console.log(student);

				await Enrollment.create({
					guardianId: guardian.id,
					studentId:  student.id,
					status: 'active'
				})
				.then( async function() {

					//console.log(classIds);

					await classIds.map( async (e) => {
						const result = await Class.findOne( { where: {id: e} } );

						//console.log(result);

						if(result) {
							StudentClass.create({
								studentId: student.id,
								classId: e
							})
						}
					})

					res.json({message: 'all occurred successfully'});
					res.status(201);

				})
				.catch(function(err) {
					res.json({message: err});
				});


			})
			.catch(function(err) {
				res.json({message: err});
			})
		})
		.catch(function(err) {
			res.json({message: err});
		})

	}	

})

app.listen(8080, function() {
	console.log('servidor rodando na porta 8080')
});
