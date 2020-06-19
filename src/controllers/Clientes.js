import {Cliente} from '../models/Cliente'
import multer from 'multer'
import moment from 'moment'

var now = moment()
moment.locale('es')
let Clientes = {}
var Handlebars = require('handlebars')

Handlebars.registerHelper("inc", function (value, options) {
  return parseInt(value) + 1
})

Clientes.index = async (req,res) => {
  const cliente = Cliente.find({}, 'id Fechas_de_pago')
  res.send(cliente)
}

Clientes.ListaClientes = async (req, res) => {
  await Cliente.find({}, (err, clientes) => {
    err ? console.log(err) : res.render('Admin/ListarClientes', {clientes})
  })
}
Clientes.PostCreaClientes = async (req, res, next) => {
  await new Cliente({...req.body}).save((err, cliente) => {
    if (err) console.log(err)
    req.userID = cliente.id
    res.redirect(`/admin/prestamo/nuevo/${req.userID}`)
  })
}
Clientes.PostEditCliente = async (req, res) => {
  await Cliente.findByIdAndUpdate('5e88bba13c5c494d6edd8df9', {...req.body}, (err) => {
    (err) ? console.log(err) : res.send('actualiizado correctamente')
  })
}
Clientes.DeleteCliente = async (req, res) => {
  await Cliente.findByIdAndRemove(req.params.id, (err) => (err) ? console.log(err) : res.redirect('/admin/clientes'))
}
Clientes.GetSubirDocumentos = async (req, res) => {
  const cliente = await Cliente.findById(req.params.id)
  let documentos = cliente.Documento
  let documentosExistentes = {}
  const docNecesarios = {
    acta: 'Acta de nacimiento',
    ine: 'INE',
    cdomicilio: 'Comprobante de domicilio',
    rfc: 'RFC',
    garantia: 'Garantia'
  }
  
  function documentoExiste(docNecesarios) {
    documentos.forEach(function (element, index, documentos) {
      if (documentos[index].Tipo == docNecesarios.acta) {
        documentosExistentes.acta = docNecesarios.acta
      }
      if (documentos[index].Tipo == docNecesarios.ine) {
        documentosExistentes.ine = docNecesarios.ine
      }
      if (documentos[index].Tipo == docNecesarios.cdomicilio) {
        documentosExistentes.cdomicilio = docNecesarios.cdomicilio
      }
      if (documentos[index].Tipo == docNecesarios.rfc) {
        documentosExistentes.rfc = docNecesarios.rfc
      }
      if (documentos[index].Tipo == docNecesarios.garantia) {
        documentosExistentes.garantia = docNecesarios.garantia
      }
    })
  }
  
  documentoExiste(docNecesarios)
  await res.render('Admin/Documento', {
    cliente: req.params.id,
    documentos,
    docs: documentosExistentes,
    mensaje: req.flash('mensaje')
  })
}
Clientes.PostSubirDocumentos = async (req, res) => {
  const cliente = await Cliente.findById(req.params.id)
  const nombreCompleto = `${cliente.Nombre}${cliente.Apellido_paterno}${cliente.Apellido_materno}`
  const randomNumber = Math.round(Math.random() * 1E9)
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, './src/public/uploads/Documentos/'),
    filename: (req, file, cb) => cb(null, `${req.body.tipo}-${nombreCompleto}-${randomNumber}.pdf`.replace(/ /g, ""))
  })
  const upload = multer({storage: storage}).single('Documento')
  upload(req, res, (err) => {
    const NombreDocumento = `${req.body.tipo}-${nombreCompleto}-${randomNumber}.pdf`.replace(/ /g, "")
    const Documento = {
      Nombre: NombreDocumento,
      Tipo: req.body.tipo,
      URL: `${process.cwd()}/uploads/Documentos/${NombreDocumento}`
    }
    if (err instanceof multer.MulterError) {
      console.log(err)
    }
    cliente.Documento.push({...Documento})
    cliente.save()
  })
    await req.flash('mensaje', 'Documento registrado correctamente')
   await res.redirect(`/admin/clientes/documento/${req.params.id}`)
}
Clientes.nuevoPrestamo = async (req, res) => {
  const cliente = await Cliente.findById(req.params.id)
  res.render('Admin/prestamos/nuevo', {cliente})
}
Clientes.fechasDePago = async (req, res) => {
  const cliente = await Cliente.findById(req.params.id)
  const meses = cliente.Prestamo.Duracion
  let Fechas_de_pago = []
  const fechaInicio = moment(cliente.Prestamo.Creacion, 'DD/MM/YYYY').format('L')
  for (let i = 0; i < meses; i++) {
    Fechas_de_pago[i] = moment(fechaInicio, 'DD/MM/YYYY').add(i + 1, 'M').format('L')
  }
  Cliente.findById(req.params.id, (err, cliente) => {
    if (err) console.log(err)
    cliente.Fechas_de_pago = Fechas_de_pago
    cliente.save()
  })
  const fecha = moment(Fechas_de_pago[0], 'DD/MM/YYYY').format('LL')
  req.flash('mensaje', `El siguiente pago es el: ${fecha}`)
  res.redirect(`/admin/clientes/profile/${req.params.id}`)
}
Clientes.postNuevoPrestamo = async (req, res) => {
  const PREstamo = {...req.body}
  const Creacion = moment().format('L')
  const Status = 'Activo'
  const Prestamo = {...PREstamo, Creacion, Status}
  await Cliente.findByIdAndUpdate(req.params.id, {Prestamo}, (err) => {
    (err) ? console.log(err) : res.redirect(`/admin/pagos/${req.params.id}`)
  })
}
Clientes.profile = async (req, res) => {
  const cliente = await Cliente.findById(req.params.id)
  const pagos = cliente.Prestamo.Pagos
  const diasDePago = moment(cliente.Prestamo.Creacion, 'DD/MM/YYYY').format('D')
  const siguienteMes = moment().add('1', 'months').format('MMMM')
  const diaMensaje = `El siguiente pago es el ${diasDePago} de ${siguienteMes}`
  if (cliente.Prestamo.Monto_restante <= 2) {
    res.render('Admin/clientProfile', {cliente, pagos, xd: 'Préstamo saldado'})
  }else res.render('Admin/clientProfile', {cliente, diaMensaje, pagos, mensaje: req.flash('mensaje')})
}

Clientes.postProfile = async (req, res) => {
  const data = {...req.body}
  const cliente = {
    Email: data.Email,
    Telefono: data.Telefono,
    Direccion: {
      Direccion_completa: data.Direccion_completa
    }
  }
  
  await Cliente.findById(req.params.id, function (err, cliente) {
    if (err) {
      console.log(err)
    } else {
      //you should to some checking if the supplied value is present (!= undefined) and if it differs from the currently stored one
      cliente.Email = data.Email
      cliente.Telefono = data.Telefono
      cliente.Direccion.Direccion_completa = data.Direccion_completa
      cliente.Prestamo.Status = data.Status
      cliente.Prestamo.Monto_total = data.Monto_total
      cliente.Prestamo.Interes = data.Interes
      cliente.Prestamo.Creacion = data.Creacion
      cliente.Prestamo.Duracion = data.Duracion
      cliente.Prestamo.Pago_previsto = data.Pago_previsto
      cliente.Prestamo.Monto_restante = data.Monto_restante
      
      cliente.save(function (err) {
        if (err) {
          console.log(err)
        } else {
          const pagos = cliente.Prestamo.Pagos
          res.render('Admin/clientProfile', {cliente, pagos})
        }
      })
    }
  })
}
Clientes.nuevoPago = async (req, res, next) => {
  const cliente = await Cliente.findById(req.params.id)
  const monto_total = cliente.Prestamo.Monto_total
  const Pago = {...req.body}
  if (cliente.Prestamo.Monto_restante) {
    const monto_restante = parseInt(cliente.Prestamo.Monto_restante) - parseInt(Pago.Monto)
    await Cliente.findByIdAndUpdate(req.params.id, {'Prestamo.Monto_restante': monto_restante}, (err) => {
      console.log(1)
      if (err) console.log(err)
      req.flash('mensaje', 'Pago registrado correctamente')
      res.redirect(`/admin/clientes/profile/${req.params.id}`)
    })
  } else {
    const monto_restante = parseInt(monto_total) - parseInt(Pago.Monto)
    console.log(3)
    await Cliente.findByIdAndUpdate(req.params.id, {'Prestamo.Monto_restante': monto_restante}, (err, cliente) => {
      if (err) console.log(err)
      req.flash('mensaje', 'Pago registrado correctamente')
      res.redirect(`/admin/clientes/profile/${req.params.id}`)
    })
  }
  cliente.Prestamo.Pagos.push({...req.body})
  cliente.save()
}
Clientes.nuevoCliente = async (req, res) => {
  res.render('Admin/nuevoCliente')
}
Clientes.deleteDocumento = async (req, res, next) => {
  const cliente = await Cliente.findById(req.params.userID)
  cliente.Documento.id(req.params.docID).remove()
  cliente.save(function (err) {
    if (err) console.log(err)
    req.flash('mensaje', 'Documento eliminado correctamente')
    res.redirect(`/admin/clientes/documento/${req.params.userID}`)
  })
}
module.exports = Clientes
