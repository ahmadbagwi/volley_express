const jwt = require("jsonwebtoken");
const checkToken = (token) => {
  let decodedToken
  if (token) {
    decodedToken = jwt.verify(token, "secretkeyappearshere")
  }
  return decodedToken
}

module.exports = {
  checkToken
}