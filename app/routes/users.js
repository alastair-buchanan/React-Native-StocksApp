const { query } = require("express");
var express = require("express");
var router = express.Router();
const secretKey = "q)o2R4@#$h8*0";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//var mysql = require("mysql2");

const authorize = (req, res, next) => {
  const authorization = req.headers.authorization;
  let token = null;
  if (authorization && authorization.split(" ").length === 2) {
    token = authorization.split(" ")[1];
  } else {
    res
      .status(401)
      .json({
        error: true,
        message: "Unauthorized",
      });
    return;
  }

  // verify jwt and check expiration date
  try {
    const decoded = jwt.verify(token, secretKey);

    if (decoded.exp < Date.now()) {
      res.status(401).json({ error: true, message: "Unauthorized 2" });
      return;
    }

    //allow user to access route
    next();
  } catch (err) {
    res.status(401).json({ error: true, message: "Unauthorized 3" });
  }
};

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.json({ status: "success" });
});

//Get user symbols
router.get("/:email/symbols", function (req, res, next) {
  (async () => {
    try {
      const query = await req.db
        .from("users")
        .select("symbols")
        .where("email", "=", req.params.email);

      let rows = await query;
      let userSymbols = Object.values(rows)[0].symbols;
      return res.json({
        Error: false,
        Message: "Success",
        Symbols: userSymbols,
      });
    } catch (err) {
      res.json({ Error: true, Message: "Error executing MySQL query" });
    }
  })();
});

router.post("/register", (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  if (!username || !password || !email) {
    res.status(400).json({
      error: true,
      message: "Request body incomplete - username, password and email needed",
    });
    return;
  }

  const queryUsers = req.db
    .from("users")
    .select("*")
    .where("email", "=", email);
  queryUsers
    .then((users) => {
      if (users.length > 0) {
        res.json({
          Error: true,
          Message: "User already exists",
        });
        return;
      }

      //insert user into db
      const saltRounds = 10;
      hash = bcrypt.hashSync(password, saltRounds);

      return req.db.from("users").insert({ email, username, password: hash });
    })
    .then(() => {
      //create and return JWT token
      const expiresIn = 60 * 60 * 24; // 1 day
      const exp = Date.now() + expiresIn * 1000;
      const token = jwt.sign({ email, exp }, secretKey);
      res.status(201).json({
        success: true,
        message: "User created",
        token_type: "Bearer",
        token,
        expiresIn,
      });
    });
});

router.post("/login", function (req, res, next) {
  
  const email = req.body.email;
  const password = req.body.password;

  //verify body
  if (!email || !password) {
    res.status(400).json({
      error: true,
      message: "Email and password required",
    });
    return;
  }

  const queryUsers = req.db
    .from("users")
    .select("*")
    .where("email", "=", email);

  queryUsers
    .then((users) => {
      if (users.length === 0) {
        return res.status(401).json({ error: true, message: "User not found" });
      } else {
        //compared to stored password
        const user = users[0];
        return bcrypt.compare(password, user.password);
      }
    })
    .then((match) => {
      if (!match) {
        res.status(401).json({ error: true, message: "Incorrect password" });
        return;
      } else {
        //create and return JWT token
        const expiresIn = 60 * 60 * 24; // 1 day
        const exp = Date.now() + expiresIn * 1000;
        const token = jwt.sign({ email, exp }, secretKey);
        res.json({ token_type: "Bearer", token, expiresIn });
      }
    });
});

router.post("/symbols/update", authorize, function (req, res, next) {
  if (!req.body.email || !req.body.symbols) {
    res.status(400).json({
      message: "error updating symbols",
    });
  } else {
    const filter = {
      email: req.body.email,
    };
    const userSymbols = {
      symbols: JSON.stringify(req.body.symbols),
    };
    req
      .db("users")
      .where(filter)
      .update(userSymbols)
      .then((_) => {
        res.json({ Error: false, Message: "Success" });
        return;
      })
      .catch((_) => {
        res.status(500).json({
          Error: true,
          Message: "database error - not updated",
        });
      });
  }
});

module.exports = router;
