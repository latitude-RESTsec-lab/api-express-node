const express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    { Client } = require('pg'),
    config = require("./config.json");

//app.use(bodyParser.urlencoded());
function errorType (er) {
    this.Reason = er;
}

app.use(bodyParser.json());
  //  db = require("./db/db"),
  //  servidorController = require("./controllers/servidor");

const client = new Client({
  database : config.DatabaseName,
  host :     config.DatabaseHost,
  port :     config.DatabasePort,
  user :     config.DatabaseUser,
  password : config.DatabasePassword,
})
client.connect()


app.get("/api/servidores", (req, res) => {
    q = `select s.id_servidor, s.siape, s.id_pessoa, s.matricula_interna, s.nome_identificacao,
        p.nome, p.data_nascimento, p.sexo from rh.servidor s
        inner join comum.pessoa p on (s.id_pessoa = p.id_pessoa)`
    client.query(q, (err, result) => {
        if (err){
            res.status(500)
            res.send("err")
        } else {
            console.log("Querry Successful\n"+q)
            res.status(200)
            res.send(result.rows) 
        }
    })
})
// app.get("/api/servidor/:mat", (req, res) => {
//     q = `select s.id_servidor, s.siape, s.id_pessoa, s.matricula_interna, s.nome_identificacao,
//         p.nome, p.data_nascimento, p.sexo from rh.servidor s
//         inner join comum.pessoa p on (s.id_pessoa =`+ "'10070'" +`)`    
//     req.params.mat
//     client.query(q, (err, result) => {
//         if (err){
//             res.status(500)
//             res.send("err")
//         } else {
//             console.log("Querry Successful\n"+q)
//             res.status(200)
//             res.send(result.rows) 
//         }
//     })
// })
app.post("/api/servidor/", (req, res) => {
    errorList = []
    regexCheck = false
    if (! /^(19[0-9]{2}|2[0-9]{3})-(0[1-9]|1[012])-([123]0|[012][1-9]|31)$/.test(req.body.data_nascimento)){
        errorList.push(new errorType("[data_nascimento] failed to match API requirements. It should look like this: 1969-02-12") )
        regexCheck = true
    } else if (new Date(req.body.data_nascimento) > new Date()){
        errorList.push(new errorType("[data_nascimento] failed to match API requirements. It should not be in the future.") )    
        regexCheck = true
    }
    if (!/^([A-Z][a-z]+([ ]?[a-z]?['-]?[A-Z][a-z]+)*)$/.test(req.body.nome)){
        errorList.push(new errorType("[data_nascimento] failed to match API requirements. It should not be in the future.") )    
        regexCheck = true
    } else if (String.length(req.body.nome)>100) {
        regexCheck = true
        errorList.push(new errorType("[nome] failed to match API requirements. It should have a maximum of 100 characters"))
    }
    if (!/^([A-Z][a-z]+([ ]?[a-z]?['-]?[A-Z][a-z]+)*)$/.test(req.body.nome_identificacao)){
        errorList.push(new errorType("[nome_identificacao] failed to match API requirements. It should look like this: Firstname Middlename(optional) Lastname"))
        regexCheck = true
    } else if (String.length(req.body.nome_identificacao)>100) {
        regexCheck = true
        errorList.push(new errorType("[nome_identificacao] failed to match API requirements. It should have a maximum of 100 characters"))
    }
    if (!/\b[MF]{1}\b/.test(req.body.sexo)){
        regexCheck = true
        errorList.push(new errorType("[sexo] failed to match API requirements. It should look like this: M for male, F for female."))
    }
    if (isNaN(req.body.Id_pessoa)){
        errorList.push(new errorType("[id_pessoa] failed to match API requirements. It should be only numeric.") )    
        regexCheck = true
    }
    if (isNaN(req.body.siape)){
        errorList.push(new errorType("[siape] failed to match API requirements. It should be only numeric." )   ) 
        regexCheck = true

    }
    if (regexCheck){
        res.status(400)
        res.send(errorList)
    }


    // q=util.format(`INSERT INTO rh.servidor_tmp(
	// 		nome, nome_identificacao, siape, id_pessoa, matricula_interna, id_foto,
	// 		data_nascimento, sexo)
	// 		VALUES ('%s', '%s', %d, %d, %d, null, '%s', '%s');
	// 		`, req.body.Nome, req.body.Nomeidentificacao, req.body.Siape, req.body.Idpessoa, req.body.Matriculainterna,
	// 	req.body.Datanascimento, req.body.Sexo)
})

app.listen(config.HttpPort);

console.log('todo list RESTful API server started on: ' + config.HttpPort);
