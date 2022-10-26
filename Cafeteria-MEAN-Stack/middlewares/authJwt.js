const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const Role = db.role;

// verifyToken = (req, res, next) => {
//   let token = req.session.token;

//   if (!token) {
//     return res.status(403).send({ message: "No token provided!" });
//   }

//   jwt.verify(token, config.secret, (err, decoded) => {
//     if (err) {
//       return res.status(401).send({ message: "Unauthorized!" });
//     }
//     req.userId = decoded.id;
//     next();
//   });
// };

const verifyToken = (req, res, next) => {
  const token =
      req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
      return res.status(403).send("A token is required for authentication");
  }
  try {
      const decoded = jwt.verify(token, config.secret);
      req.user = decoded;
      req.userId = decoded.id;
  } catch (err) {
      return res.status(401).send("Invalid Token");
  }
  return next();


};

isAdmin = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles },
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "admin") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require Admin Role!" });
        return;
      }
    );
  });
};



const authJwt = {
  verifyToken,
  isAdmin,
};
module.exports = authJwt;