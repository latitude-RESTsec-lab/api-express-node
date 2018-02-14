const express = require('express'),
    app = express(),
    util = require('util'),
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
            for(var i=0; i<result.rowCount; i++){
                var data = new Date(result.rows[i].data_nascimento).toISOString().replace(/[A-Z]([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9].[0-9][0-9][0-9][A-Z]/, "");
                result.rows[i].data_nascimento=data;
            }
            console.log("Querry Successful\n"+q)
            res.status(200)
            res.send(result.rows) 
        }
    })
})
app.get("/api/servidor/:mat", (req, res) => {
     q = util.format(`select s.id_servidor, s.siape, s.id_pessoa, s.matricula_interna, s.nome_identificacao,
     p.nome, p.data_nascimento, p.sexo from rh.servidor s
    inner join comum.pessoa p on (s.id_pessoa = p.id_pessoa)
     where s.matricula_interna = %s`, req.params.mat)
     client.query(q, (err, result) => {
         if (err){
             res.status(500)
             res.send(err)
         } else {
            for(var i=0; i<result.rowCount; i++){
                var data = new Date(result.rows[i].data_nascimento).toISOString().replace(/[A-Z]([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9].[0-9][0-9][0-9][A-Z]/, "");
                result.rows[i].data_nascimento=data;
            }
             console.log("Querry Successful\n"+q)
             res.status(200)
             res.send(result.rows) 
         }
     })
 })


app.listen(config.HttpPort);

console.log('todo list RESTful API server started on: ' + config.HttpPort);
