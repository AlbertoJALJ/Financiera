import {Cliente} from "../models/Cliente"
const express = require('express');
const router = express.Router();
import {isAdmin, isUser} from '../libs/auth'
import moment from 'moment'
moment()
moment.locale('es')

router.get('/', isUser, async (req,res) => {
  const cliente = await Cliente.findById(req.user.userID)
  const pagos = cliente.Prestamo.Pagos
  const diasDePago = moment(cliente.Prestamo.Creacion, 'DD/MM/YYYY').format('D')
  const siguienteMes = moment().add('1', 'months').format('MMMM')
  const diaMensaje = `Tu siguiente pago es el ${diasDePago} de ${siguienteMes}`
  let documentos = cliente.Documento
 if (cliente.Prestamo.Monto_restante <= 2) {
    res.render('Client/index', {layout:false,documentos,cliente, pagos, xd: 'Préstamo saldado'})
  }else res.render('Client/index', {layout:false,cliente,documentos, diaMensaje, pagos, mensaje: req.flash('mensaje')})
})
module.exports = router;
