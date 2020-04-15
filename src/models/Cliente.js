const mongoose = require('../libs/database')
const Schema = mongoose.Schema;

const ClienteSchema = new Schema({
  Nombre : String,
  Apellido_paterno: String,
  Apellido_materno: String,
  Fecha_nacimiento: String,
  Curp : String,
  RFC : String,
  Email : String,
  Direccion : {
    Direccion_completa : String,
    Coordenadas : String
  },
  Garantia : [{
    Nombre : String,
    Tipo : String,
    URL : String
  }],
  Documento : [{
    Nombre : String,
    Tipo : String,
    URL : String
  }],
  Prestamo : {
    Status : String,
    Monto_total : Number,
    Monto_total_intereses : Number,
    Creacion : String,
    Duracion : Number,
    Interés : Number,
    Pagos : [{
      Fecha : String,
      Numero : String,
      Monto : String,
    }]
  }
});
const Cliente = mongoose.model('Cliente', ClienteSchema)
export { Cliente }