import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()
const uri = process.env.MONGODB_URI;
mongoose.Promise = global.Promise;

mongoose.connect(uri,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
 }).then(db=> console.log('Conexión a la DB exitosa'))
    .catch(db=> console.error(err))
 ;
module.exports = mongoose