const mongoose = require('../libs/database')
const Schema = mongoose.Schema;

const ClienteSchema = new Schema({
  username : String,
  Nombre : String,
  Apellido_paterno: String,
  Apellido_materno: String,
  Fecha_nacimiento: String,
  Fechas_de_pago : Array,
  Curp : String,
  RFC : String,
  Email : String,
  Telefono : Number,
  Direccion : {
    Direccion_completa : String,
    Coordenadas : String
  },
  Documento : [{
    Nombre : String,
    Tipo : String,
    URL : String
  }],
  Prestamo : {
    Status : String,
    Monto_prestamo : Number,
    Monto_interes : Number,
    Monto_total : Number,
    Monto_restante : Number,
    Creacion : String,
    Duracion : Number,
    Interes : Number,
    Pago_previsto: Number,
    Pagos : [{
      Fecha : String,
      Monto : String,
    }]
  }
});
const Cliente = mongoose.model('Cliente', ClienteSchema)
export { Cliente }
