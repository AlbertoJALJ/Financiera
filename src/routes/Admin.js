const express = require('express');
const router = express.Router();
import {
  profile,
  postProfile,
  nuevoPago,
  postNuevoPrestamo,
  nuevoPrestamo,
  GetSubirDocumentos,
  PostSubirDocumentos,
  DeleteCliente,
  ListaClientes,
  PostEditCliente,
  PostCreaClientes,
  nuevoCliente,
  deleteDocumento,
  calendar,
  fechasDePago
} from '../controllers/Clientes'
import {assignUser} from '../controllers/AuthController'
import {isAdmin, isUser} from '../libs/auth'
/* GET home page. */
router.get('/pagos/:id',isAdmin, fechasDePago)
router.get('/clientes',isAdmin, ListaClientes)
router.get('/create/cliente/',isAdmin, nuevoCliente)
router.post('/create/cliente',isAdmin, PostCreaClientes)
router.post('/clientes/edit',isAdmin, PostEditCliente)
router.get('/delete/:id',isAdmin, DeleteCliente)
router.get('/clientes/documento/:id',isAdmin, GetSubirDocumentos)
router.post('/clientes/documento/:id',isAdmin, PostSubirDocumentos)
router.get('/prestamo/nuevo/:id',isAdmin, nuevoPrestamo)
router.post('/prestamo/nuevo/:id',isAdmin, postNuevoPrestamo)
router.get('/clientes/profile/:id',isAdmin, profile)
router.post('/clientes/profile/:id',isAdmin, postProfile)
router.post('/clientes/pago/nuevo/:id',isAdmin, nuevoPago)
router.get('/clientes/assignUser/:id',isAdmin, assignUser)
router.get('/clientes/documentos/eliminar/:userID/:docID',isAdmin,  deleteDocumento)

module.exports = router;
