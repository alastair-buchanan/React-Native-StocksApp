const { query } = require("express");
var express = require("express");
var router = express.Router();
//var mysql = require("mysql2");

const authorize = (req, res, next) => {
  const authorization = req.headers.authorization;
  let token = null;

  //retrieve token
  if (authorization && authorization.split(" ").length === 2) {
    token = authorization.split(" ")[1];
  } else {
    res.status(401).json({ error: true, message: "Unauthorized" });
    return;
  }

  // verify jwt and check expiration date
  try {
    const decoded = jwt.verify(token, secretKey);

    if (decoded.exp < Date.now()) {
      res.status(401).json({ error: true, message: "Unauthorized" });
      return;
    }

    //allow user to access route
    next();
  } catch (err) {
    res.status(401).json({ error: true, message: "Unauthorized" });
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
      return res.json({ Error: false, Message: "Success", Symbols: userSymbols });
    } catch (err) {
      console.log(err);
      res.json({ Error: true, Message: "Error executing MySQL query" });
    }
  })();

  // var query = "SELECT username, email, password FROM ??;";
  // var table = ["users"];

  // query = mysql.format(query, table);

  // req.db.query(query, function (err, rows) {
  //   if (err) {
  //     res.json({
  //       Error: true,
  //       Message: `Error executing MySQL query: ${err}`,
  //     });
  //   } else {
  //     res.json({
  //       Error: false,
  //       Message: "success",
  //       users: rows,
  //     });
  //   }
  // });
});

// router.post('/symbols/update', (req, res, next) => {
//   if (!req.body.email || !req.body.symbols) {
//     res.status(400).json({
//       message: 'error updating symbols'
//     })
//     console.log('error on request body: ', JSON.stringify(req.body))
//   } else {
//     const filter = {
//       'email': req.body.email
//     }
//     const userSymbols = {
//       'symbols': req.body.symbols
//     }

//     req.db('users').where(filter).update(userSymbols).then(_ => {
//       res.status(201).json({
//         message: `successfully updated ${req.body.email}`
//       })
//       console.log("successful symbol update: ", JSON.stringify(filter))
//     }).catch(_ => {
//       res.status(500).json({
//         message: 'database error - not updated'
//       })
//     })
//   }
// });

router.post("/register", (req, res) => {
  const bcrypt = require("bcrypt");
  const jwt = require("jsonwebtoken");
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
      const secretKey = "q)o2R4@#$h8*0";
      const expiresIn = 10; // 1 day
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

  // var query = "INSERT INTO users (email, username, password) VALUES (?, ?, ?);";
  // var table = [email, username, password]

  // query = mysql.format(query, table);

  // req.db.query(query, function (err) {
  //   if (err) {
  //     res.json({
  //       Error: true,
  //       Message: `Error executing MySQL query: ${err}`,
  //     });
  //   } else {
  //     res.json({
  //       Error: false,
  //       Message: "success",
  //     });
  //   }
  // });
});

router.post("/login", function (req, res, next) {
  const bcrypt = require("bcrypt");
  const jwt = require("jsonwebtoken");
  const email = req.body.email;
  const password = req.body.password;
  let isUserInvalid = false;

  //verify body
  if (!email || !password) {
    res.status(400).json({
      error: true,
      message: "Request body incomplete - email and password required",
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
        isUserInvalid = true;
        return;
      } else {
        //compared to stored password
        const user = users[0];
        return bcrypt.compare(password, user.password);
      }
    })
    .then((match) => {
      if (!match || isUserInvalid) {
        res.status(401).json({ error: true, message: "Unauthorized" });
        return;
      } else {
        //create and return JWT token
        const secretKey = "q)o2R4@#$h8*0";
        const expiresIn = 10; // 1 day
        const exp = Date.now() + expiresIn * 1000;
        const token = jwt.sign({ email, exp }, secretKey);
        res.json({ token_type: "Bearer", token, expiresIn });
      }
    });
});



router.post("/symbols/update", authorize, function (req, res, next) {
  if (!req.body.email || !req.body.symbols) {
    res.status(400).json({
      message: 'error updating symbols'
    })
    console.log('error on request body: ', JSON.stringify(req.body))
  } else {
    const filter = {
      'email': req.body.email
    }
    const userSymbols = {
      'symbols': JSON.stringify(userSymbols)
    }
    console.log(JSON.stringify(userSymbols));
    //{"symbols":"[\"GILD\",\"XEL\"]"}
    //console.log("update response", req.db('users').where(filter));
    req.db('users').where(filter).update(userSymbols).then(_ => {
      //Update this later with redirect.
    //console.log("update response", res);

      console.log("successsssssssssssssssssssssss");
    }).catch(_ => {
      res.status(500).json({
        message: 'database error - not updated'
      })
    })
  }












  const email = req.body.email;
  const symbols = req.body.symbols;


  //verify body
  if (!email || !symbols) {
    res.status(400).json({
      error: true,
      message: "Request body incomplete - email and password required",
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
        res.status(401).json({ error: true, message: "User doesn't exist" });
        return;
      } else {
        //compared to stored password
        const user = users[0];
      }
    })
    .then((match) => {
      if (!match || isUserInvalid) {
        res.status(401).json({ error: true, message: "Unauthorized" });
        return;
      } else {
        //create and return JWT token
        const secretKey = "q)o2R4@#$h8*0";
        const expiresIn = 10; // 1 day
        const exp = Date.now() + expiresIn * 1000;
        const token = jwt.sign({ email, exp }, secretKey);
        res.json({ token_type: "Bearer", token, expiresIn });
      }
    });
});





module.exports = router;
