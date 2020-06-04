import { config } from 'dotenv'
import handlebars from 'handlebars'
import { Cliente } from '../models/Cliente'
import multer from 'multer'
import moment from 'moment'
var now = moment();
moment.locale('es');
let Clientes = {}
var Handlebars = require('handlebars');

Handlebars.registerHelper("inc", function(value, options)
{
  return parseInt(value) + 1;
});

Clientes.ListaClientes = async (req, res) => {
    await Cliente.find({}, (err, clientes) => {
        err ? console.log(err) : res.render('Admin/ListarClientes', { clientes })
    })
}
Clientes.PostCreaClientes = async (req, res) => {
    await new Cliente({ ...req.body }).save()
    res.send('exito')
}
Clientes.PostEditCliente = async (req, res) => {
    await Cliente.findByIdAndUpdate('5e88bba13c5c494d6edd8df9', { ...req.body }, (err) => {
        (err) ? console.log(err) : res.send('actualiizado correctamente')
    })
}
Clientes.DeleteCliente = async (req, res) => {
    await Cliente.findByIdAndRemove(req.body.id, (err) => (err) ? console.log(err) : res.send('Eliminado correctamente'))
}
Clientes.GetSubirDocumentos = async (req, res) => {
    res.render('Admin/Documento', { id: req.params.id })
}

Clientes.PostSubirDocumentos = async (req, res) => {
    const cliente = await Cliente.findById(req.params.id)
    const nombreCompleto = `${cliente.Nombre}${cliente.Apellido_paterno}${cliente.Apellido_materno}`
    const randomNumber = Math.round(Math.random() * 1E9)
    const storage = multer.diskStorage({
        destination : ( req, file, cb ) => cb(null, 'uploads/Documentos/'),
        filename: ( req, file, cb ) => cb(null, `${req.body.tipo}-${nombreCompleto}-${randomNumber}.pdf`.replace(/ /g, ""))
    })
    const upload = multer({ storage: storage }).single('Documento')
    upload ( req, res, (err) =>{
        const NombreDocumento = `${req.body.tipo}-${nombreCompleto}-${randomNumber}.pdf`.replace(/ /g, "")
        const Documento = {
            Nombre : NombreDocumento,
            Tipo: req.body.tipo,
            URL : `${process.cwd()}/uploads/Documentos/${NombreDocumento}`
        }
        if (err instanceof multer.MulterError) {
            console.log(err)
        }
        cliente.Documento.push({...Documento})
        cliente.save()
    })
}

Clientes.ListaDocumentos = async (req,res) => { //Pensar en una mejor forma de mostrar el listado de los documentos
    const cliente = await Cliente.findById(req.params.id)
    let documentos = cliente.Documento
    /*let documentosExistentes = {};
    const docNecesarios = {
        acta : 'Acta de nacimiento',
        ine : 'INE',
        cdomicilio: 'Comprobante de domicilio',
        rfc: 'RFC'
    }
    function documentoExiste(docNecesarios) {
        documentos.forEach(function(element,index,documentos){
            if (documentos[index].Tipo == docNecesarios.acta){
                documentosExistentes.acta = docNecesarios.acta
            }
            if (documentos[index].Tipo == docNecesarios.ine){
                documentosExistentes.ine = docNecesarios.ine
            }
            if (documentos[index].Tipo == docNecesarios.cdomicilio){
                documentosExistentes.cdomicilio = docNecesarios.cdomicilio
            }
            if (documentos[index].Tipo == docNecesarios.rfc){
                documentosExistentes.rfc = docNecesarios.rfc
            }
        })
    }
    documentoExiste(docNecesarios)*/
    res.render('Admin/documentos/lista', {documentos})
}
Clientes.nuevoPrestamo = async (req,res) => {
    const cliente = await Cliente.findById(req.params.id)
    res.render('Admin/prestamos/nuevo', {cliente})
}
Clientes.postNuevoPrestamo = async (req,res) => {
    const PREstamo = {...req.body}
    const Creacion = moment().format('L')
    const Status = 'Activo'
    const Prestamo = {...PREstamo, Creacion, Status}
    
    const fechas_de_pago = moment(Creacion, "DD-MM-YYYY").add('days', 5);
    await Cliente.findByIdAndUpdate(req.params.id, { Prestamo }, (err) => {
        (err) ? console.log(err) : res.send('actualizado correctamente')
    })
}
Clientes.profile = async (req,res) => {
    const cliente = await Cliente.findById(req.params.id)
    const pagos = cliente.Prestamo.Pagos
    res.render('Admin/clientProfile', {cliente, pagos})
}
Clientes.postProfile = async (req,res) => {
    const data = {...req.body }
    const  cliente = {
        Email: data.Email,
        Telefono: data.Telefono,
        Direccion: {
            Direccion_completa: data.Direccion_completa
        }
    }
    
    await Cliente.findById(req.params.id, function (err, cliente) {
        console.log(...req.body)
        if (err) {
            console.log(err)
        }
        else {
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
            
             cliente.save( function (err) {
                if (err) {
                    console.log(err)
                }
                else {
                    const pagos = cliente.Prestamo.Pagos
                    res.render('Admin/clientProfile', {cliente, pagos})
                }
            });
        }
    });
}
Clientes.nuevoPago = async (req,res) => {
    const cliente = await Cliente.findById(req.params.id)
    const monto_total = cliente.Prestamo.Monto_total
    const Pago = {...req.body}
    if (cliente.Prestamo.Monto_restante) {
        const monto_restante = parseInt(cliente.Prestamo.Monto_restante) - parseInt(Pago.Monto)
        await Cliente.findByIdAndUpdate(req.params.id, {'Prestamo.Monto_restante':monto_restante}, (err) => {
            (err) ? console.log(err) : res.send('actualizado correctamente')
        })
        console.log(1)
    } else {
        const monto_restante = parseInt(monto_total) - parseInt(Pago.Monto)
        await Cliente.findByIdAndUpdate(req.params.id, {'Prestamo.Monto_restante':monto_restante}, (err) => {
            (err) ? console.log(err) : res.send('actualizado correctamente')
        })
        console.log(2)
    }
    cliente.Prestamo.Pagos.push({...req.body})
    cliente.save()
}
module.exports = Clientes

