import { config } from 'dotenv'
import handlebars from 'handlebars'
import { Cliente } from '../models/Cliente'
import multer from 'multer'
import path from 'path'
let Clientes = {}

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
    console.log(cliente)
    const nombreCompleto = `${cliente.Nombre}${cliente.Apellido_paterno}${cliente.Apellido_materno}`
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, 'uploads/')
        },
        filename: function (req, file, cb) {
          cb(null, `${req.body.tipo}-${nombreCompleto}-${Math.round(Math.random() * 1E9)}.pdf`.replace(/ /g, ""))
        }
    })
    const upload = multer({ storage: storage }).single('Documento')
    upload(req, res, function (err) {
        (err instanceof multer.MulterError) ? console.log(err) : console.log('Todo ok')
    })
}
Clientes.CheckIfDocExists = async (req,res) => {//pendiente comprobar si existen todos los documentos
    const cliente = await Cliente.findById(req.params.id)
    res.send(cliente)
}
module.exports = Clientes