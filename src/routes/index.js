var express = require('express');
var router = express.Router();
import {CheckIfDocExists, GetSubirDocumentos, PostSubirDocumentos, DeleteCliente, ListaClientes ,PostEditCliente ,PostCreaClientes} from '../controllers/Clientes'
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post('/clientes/create', PostCreaClientes)
router.get('/clientes', ListaClientes)
router.post('/clientes/edit', PostEditCliente)
router.post('/clientes/delete', DeleteCliente)
router.get('/clientes/documento/:id', GetSubirDocumentos)
router.post('/clientes/documento/:id', PostSubirDocumentos)
router.get('/clientes/checkDocuments/:id', CheckIfDocExists)


module.exports = router;
