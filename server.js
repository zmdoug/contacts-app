// Configurações do servidor e da conexão com banco de dados (MongoDB).

var express = require("express"); // Adicionando framework express
var bodyParser = require("body-parser"); // Middleware para requisições
var mongodb = require("mongodb"); // Banco de dados
var ObjectID = mongodb.ObjectID; // Define id do objeto

var CONTACTS_COLLECTION = "contacts"; // Define a coleção do banco de dados

var app = express(); // Executa express
app.use(bodyParser.json());

// Cria variável do banco de dados fora da conexão com o banco para pode reutilizar no app.
var db;

// Cria variável do banco de dados fora da conexão com o banco para pode reutilizar no app.
var db;

// Conecta com a base de dados antes de rodar o servidor do app. 
mongodb.MongoClient.connect(process.env.MONGODB_URI || "mongodb://acesso:senha123@ds163020.mlab.com:63020/limberapp", function (err, client) {
  if (err) {
    console.log(err); 
    process.exit(1);
  }

  // Salva o objeto da base de dados.
  db = client.db();
  console.log("Conexão com o banco de dados pronta");

  // Inicializa o app.
  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App rodando na porta:", port);
  });
});

// CONTACTS API ROUTES BELOW