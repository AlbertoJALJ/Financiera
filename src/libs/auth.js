function isAdmin(req,res,next) {
  console.log(req.user)
  if (req.user && req.user.isAdmin) {
    req.isAdmin = true
    next()
  } else res.redirect('/login')
}
function isUser(req,res,next) {
  if (req.user) {
    req.isUser = true
    next();
  } else res.redirect('/login')
}
module.exports = {isAdmin,isUser}
