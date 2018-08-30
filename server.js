// Configurações do servidor e da conexão com banco de dados (MongoDB).

var express = require("express"); // Adicionando framework express
var bodyParser = require("body-parser"); // Middleware para requisições
var mongodb = require("mongodb"); // Banco de dados
var ObjectID = mongodb.ObjectID; // Define id do objeto

var CONTACTS_COLLECTION = "contacts"; // Define a coleção do banco de dados

var app = express(); // Executa express
app.use(bodyParser.json());


// Cria link para o diretório de build do Angular
var distDir = __dirname + "/dist/";
app.use(express.static(distDir));

// Cria variável do banco de dados fora da conexão com o banco para pode reutilizar no app.
var db;

 

// Conecta com a base de dados antes de rodar o servidor do app. 
mongodb.MongoClient.connect(process.env.MONGODB_URI || "mongodb://:@ds163020.mlab.com:63020/limberapp", function (err, client) {
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

// ROTAS DA API CONTACT

// Função de retorno de erros.
function exibeErro(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

/*  "/api/contact"
 *    GET: Busca todos contatos
 *    POST: Cria um novo contato
 */

app.get("/api/contacts", function(req, res) {
  db.collection(CONTACTS_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      exibeErro(res, err.message, "Falha ao buscar contatos.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.post("/api/contacts", function(req, res) {
  var newContact = req.body;
  newContact.createDate = new Date();

  if (!req.body.name) {
    exibeErro(res, "Dados inválidos", "Insira um nome.", 400);
  } else {
    db.collection(CONTACTS_COLLECTION).insertOne(newContact, function(err, doc) {
      if (err) {
        exibeErro(res, err.message, "Falha ao criar novo contato");
      } else {
        res.status(201).json(doc.ops[0]);
      }
    });
  }
});

/*  "/api/contact/:id"
 *    GET: Busca um contato pelo id
 */

app.get("/api/contacts/:id", function(req, res) {
  db.collection(CONTACTS_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
    if (err) {
      exibeErro(res, err.message, "Falha ao buscar contato");
    } else {
      res.status(200).json(doc);
    }
  });
});

/*  "/api/contact/:id"
 *    PUT: Atualiza um contato usando id
 */


app.put("/api/contacts/:id", function(req, res) {
  var updateDoc = req.body;
  delete updateDoc._id;
   db.collection(CONTACTS_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, {$set:{"name": req.body.name, "email": req.body.email, "twitter": req.body.twitter, "phone": req.body.phone}}, function(err, doc){
    if (err) {
      exibeErro(res, err.message, "Falha ao atualizar contato");
    } else {
      updateDoc._id = req.params.id;
      res.status(200).json(updateDoc);
    }
  });
});

/*  "/api/contact/:id"
 *    DELETE: Deleta um contato usando id
 */

app.delete("/api/contacts/:id", function(req, res) {
  db.collection(CONTACTS_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
    if (err) {
      exibeErro(res, err.message, "Falha ao deletar contato");
    } else {
      res.status(200).json(req.params.id);
    }
  });
});
