const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3001;

app.get("/api/balance", (req, res) => {
  const balance = fs.readFileSync(path.join(__dirname, "balance.json"));
  res.send(JSON.parse(balance));
});

app.get("/api/loans", (req, res) => {
  const loans = fs.readFileSync(path.join(__dirname, "loans.json"));
  res.send(JSON.parse(loans));
});

app.listen(port);
