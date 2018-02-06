const express = require('express'),
    app = express(),
    { Client } = require('pg'),
    config = require("./config.json");
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
// app.route("/api/servidor/").postt(servidorController.postServidor())

app.listen(config.HttpPort);

console.log('todo list RESTful API server started on: ' + config.HttpPort);
