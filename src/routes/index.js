const express = require('express');
const router = express.Router();
import {profile, postProfile ,nuevoPago, postNuevoPrestamo, nuevoPrestamo, ListaDocumentos, GetSubirDocumentos, PostSubirDocumentos, DeleteCliente, ListaClientes ,PostEditCliente ,PostCreaClientes} from '../controllers/Clientes'
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
router.get('/clientes/listaDocumentos/:id', ListaDocumentos)
router.get('/clientes/prestamo/nuevo/:id', nuevoPrestamo)
router.post('/clientes/prestamo/nuevo/:id', postNuevoPrestamo)
router.get('/clientes/profile/:id', profile)
router.post('/clientes/profile/:id', postProfile)
router.post('/clientes/pago/nuevo/:id', nuevoPago)

module.exports = router;
