const { v4: uuidv4 } = require('uuid');
const express = require("express");
const app = express();
const Redis = require("ioredis");
const crumbs = new Redis();

crumbs.set("wire", "['wire_set: json-crumbs']"); // returns promise which resolves to string, "OK"

crumbs.get("wire", function (err, result) {
  if (err) {
    console.error(err);
  } else {
    console.log(result); // Promise resolves to "bar"
  }
});

// our default array of dreams
const dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
];

app.use(express.static('public'))
app.set('view engine', 'ejs')

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (req, res) => {
  var uid1h = uuidv4()
  var uid24h = uuidv4()
  var uid7d = uuidv4()
  var uid30d = uuidv4()
  res.render('index', { uuid1h: uid1h, uuid24h: uid24h, uuid7d: uid7d, uuid30d: uid30d});
  //res.redirect("/" + uuidv4())
  //res.sendFile(__dirname + "/views/index.html");
});

// send the default array of dreams to the webpage
app.get("/api/:uid", (req, res) => {
  //res.render('uuid', { uuid: req.params.uid });
  //res.json(dreams);
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
