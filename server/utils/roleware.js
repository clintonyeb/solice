module.exports = function (role) {
  return function(req, res, next) {
    const error = new Error("Does not have authorization to this resource");
    if (!req.user) return next(error);
    if (req.user < role) return next(error);
    next();
  }; 
}
