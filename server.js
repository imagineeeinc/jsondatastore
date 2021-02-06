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
//crumbs.expire("wire", "1");

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
  var uid1h = genUuid()
  var uid24h = genUuid()
  var uid7d = genUuid()
  var uid30d = genUuid()
  var uidinf = genUuid()
  res.render('index', { uuid1h: uid1h, uuid24h: uid24h, uuid7d: uid7d, uuid30d: uid30d, uuidinf: uidinf});
  //res.redirect("/" + uuidv4())
  //res.sendFile(__dirname + "/views/index.html");
  setDb(uid1h, uid24h, uid7d, uid30d, uidinf)
});

// send the default array of dreams to the webpage
app.get("/api/:uid", (req, res) => {
  //res.render('uuid', { uuid: req.params.uid });
  //res.json(dreams);
});

// listen for requests :)
const listener = app.listen(3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

function genUuid() {
  //var val
  var theuuid = uuidv4()
  var ret
  crumbs.exists(theuuid, function (err, result) {
    if (err) {
      console.error(err);
    } else {
      //console.log(result); // Promise resolves to "bar"
      if (result == 1) {
        ret = false
      } else if (result == 0) {
      }
    }
  });
  if (ret = true) {
    return theuuid
  } else {
    return genUuid()
  }
}
function setDb(h1, h24, d7, d30, inf) {
  //1 hour
  crumbs.set(h1, JSON.stringify({
    _creation_date: Math.round((new Date()).getTime() / 1000),
    _last_modified: Math.round((new Date()).getTime() / 1000),
    _db_time: "1h",
    _db: []
  }));
  crumbs.expire(h24, "3600");
  //24 hours
  crumbs.set(h1, JSON.stringify({
    _creation_date: Math.round((new Date()).getTime() / 1000),
    _last_modified: Math.round((new Date()).getTime() / 1000),
    _db_time: "24h",
    _db: []
  }));
  crumbs.expire(h24, "86400");
  //7 days
  crumbs.set(d7, JSON.stringify({
    _creation_date: Math.round((new Date()).getTime() / 1000),
    _last_modified: Math.round((new Date()).getTime() / 1000),
    _db_time: "7d",
    _db: []
  }));
  crumbs.expire(d7, "604800");
  //30 days
  crumbs.set(d30, JSON.stringify({
    _creation_date: Math.round((new Date()).getTime() / 1000),
    _last_modified: Math.round((new Date()).getTime() / 1000),
    _db_time: "30d",
    _db: []
  }));
  crumbs.expire(d30, "2592000");
  //infinate
  crumbs.set(inf, JSON.stringify({
    _creation_date: Math.round((new Date()).getTime() / 1000),
    _last_modified: Math.round((new Date()).getTime() / 1000),
    _db_time: "inf",
    _db: []
  }));
}