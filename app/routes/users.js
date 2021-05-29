var express = require("express");
var router = express.Router();
var mysql = require("mysql2");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.json({ status: "success" });
});

router.get("/user", function (req, res, next) {
  var query = "SELECT username, email, password FROM ??;";
  var table = ["users"];

  query = mysql.format(query, table);

  req.db.query(query, function (err, rows) {
    if (err) {
      res.json({
        Error: true,
        Message: `Error executing MySQL query: ${err}`,
      });
    } else {
      res.json({
        Error: false,
        Message: "success",
        users: rows,
      });
    }
  });
});

router.get("/login/:username", function (req, res, next) {
  var query = "SELECT username, email, password FROM ?? WHERE ??=?;";
  var table = ["users", "username", req.params.username];

  query = mysql.format(query, table);

  req.db.query(query, function (err, rows) {
    if (err) {
      res.json({
        Error: true,
        Message: `Error executing MySQL query: ${err}`,
      });
    } else {
      res.json({
        Error: false,
        Message: "success",
        users: rows,
      });
    }
  });
});

router.post("/register", (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  if (!username || !password || !email) {
    res.status(400).json({
      error: true,
      message: "Request body incomplete - username, password and email needed"
    })
    return
  }

  var query = "INSERT INTO users (email, username, password) VALUES (?, ?, ?);";
  var table = [email, username, password]

  query = mysql.format(query, table);

  req.db.query(query, function (err) {
    if (err) {
      res.json({
        Error: true,
        Message: `Error executing MySQL query: ${err}`,
      });
    } else {
      res.json({
        Error: false,
        Message: "success",
      });
    }
  });
});

module.exports = router;
