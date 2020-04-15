function isAdmin(req,res,next) {
  if (req.user && req.user.isAdmin) {
    next()
  } else res.redirect('/login')
}
function isHuesped(req,res,next) {
  if (req.user) {
    next();
  } else res.redirect('/login')
}
module.exports = {isAdmin,isHuesped}