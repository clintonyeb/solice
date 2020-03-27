function roleName(role) {
  switch (role) {
    case 0:
      return "USER";
    case 1:
      return "MODERATOR";
    case 2:
      return "ADMIN";
  }
}


module.exports = {
  roleName,
}
