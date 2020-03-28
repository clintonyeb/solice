module.exports = function(role) {
  return function(req, _res, next) {
    const error = new Error("Does not have authorization to this resource");
    error.name = "UnauthorizedError";
    
    const user = req.user ? req.user.data : null;
    if (!user) return next(error);
    if (user.role < role) return next(error);
    next();
  };
};
