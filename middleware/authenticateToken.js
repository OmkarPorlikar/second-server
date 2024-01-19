import pkg from "jsonwebtoken";
const {verify} =pkg;
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  verify(token, process.env.SECRET, (err, user) => {
    console.log("Verifying Tokens")
    if (err) {
      console.log("Error occured")
      if (err.name === 'TokenExpiredError') {
        console.log("I am here")
        // Token has expired, redirect the user to the login page
        // window.location.href = '/Login'
      } else {
        console.log("mistake occurred");
        return res.sendStatus(403);
      }
    }
    next();
});

}

export default authenticateToken;
