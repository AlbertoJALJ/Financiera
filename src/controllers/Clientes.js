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
    const nombreCompleto = `${cliente.Nombre}${cliente.Apellido_paterno}${cliente.Apellido_materno}`
    const randomNumber = Math.round(Math.random() * 1E9)
    const storage = multer.diskStorage({
        destination : ( req, file, cb ) => cb(null, 'uploads/'),
        filename: ( req, file, cb ) => cb(null, `${req.body.tipo}-${nombreCompleto}-${randomNumber}.pdf`.replace(/ /g, ""))
    })
    const upload = multer({ storage: storage }).single('Documento')
    upload ( req, res, (err) =>{
        const NombreDocumento = `${req.body.tipo}-${nombreCompleto}-${randomNumber}.pdf`.replace(/ /g, "")
        const Documento = {
            Nombre : NombreDocumento,
            Tipo: req.body.tipo,
            URL : `${process.cwd()}/uploads/${NombreDocumento}`
        }
        if (err instanceof multer.MulterError) {
            console.log(err)
        }
        cliente.Documento.push({...Documento})
        cliente.save()
    })
}
Clientes.CheckIfDocExists = async (req,res) => {//pendiente comprobar si existen todos los documentos
    const cliente = await Cliente.findById(req.params.id)
    res.send(cliente)
}
module.exports = Clientes