import mongoose from 'mongoose'
import passport from 'passport'
import User from '../models/User'
import {Cliente} from '../models/Cliente'
let userController = {}

// Post registration
userController.doRegister = (req, res) => {
  User.register(new User({ username : req.body.username, name: req.body.name, isAdmin: Boolean(req.body.isAdmin) }), req.body.password, (err, user) => {
    (err) ? res.send('nombre de usuario existente') : res.send('Creado correctamente')
  })
}
userController.login = (req, res) => {
  res.render('login', {layout: false})
}
userController.doLogin = (req, res) => passport.authenticate('local')(req, res, () => res.redirect('/check'))
userController.logOut = (req, res) => {
  req.logout()
  res.redirect('/login')
}
userController.assignUser = async (req, res) => {
  const cliente = await Cliente.findById(req.params.id)
  req.userID = cliente.id
  const username = `${cliente.Nombre}${(Math.round(Math.random() * 1E3))}`.replace(/ /g, "")
  const password = (Math.round(Math.random() * 1E5)).toString()
  User.register(new User({ username : username, name: cliente.Nombres, userID: cliente.id }), password, (err, user) => {
    if (err) console.log(err.message)
      else  Cliente.findByIdAndUpdate(req.params.id,{username}, (err) => {
        if (err) console.log(err.message)
          req.flash('mensaje', `Nombre de usuario: ${username} contraseña: ${password}`)
          res.redirect(`/admin/clientes/profile/${req.params.id}`)
    })
  })
}

module.exports = userController;
