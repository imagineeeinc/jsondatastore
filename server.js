const { v4: uuidv4 } = require('uuid');
const express = require("express");
const app = express();
const Redis = require("ioredis");
require('dotenv').config()
//const crumbs = new Redis();
const crumbs = new Redis({
    host: process.env.host || "127.0.0.1",
    port: process.env.port || 6379,
    password: process.env.password || ""
});
crumbs.set("wire", "['wire_set: json-crumbs']"); // returns promise which resolves to string, "OK"

crumbs.get("wire", function (err, result) {
  if (err) {
    console.error(err);
  } else {
    console.log(result); // Promise resolves to "bar"
  }
});
//crumbs.expire("wire", "1");


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
app.get("/api/:uid", (req, res) => {
  crumbs.exists(req.params.uid, function (err, result) {
    if (err) {
      console.error(err);
    } else {
      //console.log(result); // Promise resolves to "bar"
      if (result == 1) {
        crumbs.get(req.params.uid, function (err, result) {
          if (err) {
            console.error(err);
            console.log(result);
            res.json({_err: err});
          } else {
            result = JSON.parse(result)
            res.json({_last_modified_date: result._last_modified, _db_exp_time: result._db_time, db: result._db})
            console.log("accsesed: " + req.params.uid)
            if (result._db_time == "7d") {
              crumbs.expire(result._name, "604800");
            } else if (result._db_time == "30d") {
              crumbs.expire(result._name, "2592000");
            } else if (result._db_time == "inf") {
              console.log("somone accsed a 'inf' database with a uuid of: " + result._name)
            }
          }
        });
      } else if (result == 0) {
        res.json({err: "The DataBase Dosen't Exist"})
      }
    }
  });
});
app.get("/api/:uid/get", (req, res) => {
  crumbs.exists(req.params.uid, function (err, result) {
    if (err) {
      console.error(err);
    } else {
      //console.log(result); // Promise resolves to "bar"
      if (result == 1) {
        crumbs.get(req.params.uid, function (err, result) {
          if (err) {
            console.error(err);
            console.log(result);
            res.json({_err: err});
          } else {
            result = JSON.parse(result)
            res.json({_last_modified_date: result._last_modified, _db_exp_time: result._db_time, db: result._db})
            console.log("accsesed: " + req.params.uid)
            if (result._db_time == "7d") {
              crumbs.expire(result._name, "604800");
            } else if (result._db_time == "30d") {
              crumbs.expire(result._name, "2592000");
            } else if (result._db_time == "inf") {
              console.log("somone accsed a 'inf' database with a uuid of: " + result._name)
            }
          }
        });
      } else if (result == 0) {
        res.json({err: "The DataBase Dosen't Exist"})
      }
    }
  });
});
app.get("/api/:uid/getdbonly", (req, res) => {
  crumbs.exists(req.params.uid, function (err, result) {
    if (err) {
      console.error(err);
    } else {
      //console.log(result); // Promise resolves to "bar"
      if (result == 1) {
        crumbs.get(req.params.uid, function (err, result) {
          if (err) {
            console.error(err);
            console.log(result);
            res.json({_err: err});
          } else {
            result = JSON.parse(result)
            res.json(result._db)
            console.log("accsesed: " + req.params.uid)
            if (result._db_time == "7d") {
              crumbs.expire(result._name, "604800");
            } else if (result._db_time == "30d") {
              crumbs.expire(result._name, "2592000");
            } else if (result._db_time == "inf") {
              console.log("somone accsed a 'inf' database with a uuid of: " + result._name)
            }
          }
        });
      } else if (result == 0) {
        res.json({err: "The DataBase Dosen't Exist"})
      }
    }
  });
});
app.get("/api/:uid/update", (req, res) => {
  var data = req.query.data
  crumbs.exists(req.params.uid, function (err, result) {
    if (err) {
      console.error(err);
    } else {
      //console.log(result); // Promise resolves to "bar"
      if (result == 1) {
        crumbs.get(req.params.uid, function (err, result) {
          if (err) {
            console.error(err);
            console.log(result);
            res.json({_err: err});
          } else {
            //req.query.
            result = JSON.parse(result)
            data = JSON.parse("[" + data + "]")
            result._db = data
            result._last_modified = Math.round((new Date()).getTime() / 1000)
            if (result._db.length < 10000) {
              crumbs.set(req.params.uid, JSON.stringify(result));
              res.json({_last_modified_date: result._last_modified, _db_exp_time: result._db_time, db: result._db})
              console.log("accsesed: " + req.params.uid)
            } else if(result._db.length > 10000) {
              console.log(req.params.uid + " db has exeded size limit of 10000")
              res.json({_last_modified_date: result._last_modified, _db_exp_time: result._db_time, db: ["size limit reached of 10000"]})
            }
            console.log("accsesed: " + req.params.uid)
            if (result._db_time == "7d") {
              crumbs.expire(result._name, "604800");
            } else if (result._db_time == "30d") {
              crumbs.expire(result._name, "2592000");
            } else if (result._db_time == "inf") {
              console.log("somone accsed a 'inf' database with a uuid of: " + result._name)
            }
          }
        });
      } else if (result == 0) {
        res.json({err: "The DataBase Dosen't Exist"})
      }
    }
  });
});
app.get("/api/:uid/add", (req, res) => {
  var data = req.query.data
  crumbs.exists(req.params.uid, function (err, result) {
    if (err) {
      console.error(err);
    } else {
      //console.log(result); // Promise resolves to "bar"
      if (result == 1) {
        crumbs.get(req.params.uid, function (err, result) {
          if (err) {
            console.error(err);
            console.log(result);
            res.json({_err: err});
          } else {
            //req.query.
            result = JSON.parse(result)
            data = JSON.parse("{\"data\": " + data + "}")
            result._db.push(data.data)
            result._last_modified = Math.round((new Date()).getTime() / 1000)
            if (result._db.length < 10000) {
              crumbs.set(req.params.uid, JSON.stringify(result));
              res.json({_last_modified_date: result._last_modified, _db_exp_time: result._db_time, db: result._db})
              console.log("accsesed: " + req.params.uid)
            } else if(result._db.length > 10000) {
              console.log(req.params.uid + " db has exeded size limit of 10000")
              res.json({_last_modified_date: result._last_modified, _db_exp_time: result._db_time, db: ["size limit reached of 10000"]})
            }
            console.log("accsesed: " + req.params.uid)
            if (result._db_time == "7d") {
              crumbs.expire(result._name, "604800");
            } else if (result._db_time == "30d") {
              crumbs.expire(result._name, "2592000");
            } else if (result._db_time == "inf") {
              console.log("somone accsed a 'inf' database with a uuid of: " + result._name)
            }
          }
        });
      } else if (result == 0) {
        res.json({err: "The DataBase Dosen't Exist"})
      }
    }
  });
});
app.get("/api/:uid/pop", (req, res) => {
  crumbs.exists(req.params.uid, function (err, result) {
    if (err) {
      console.error(err);
    } else {
      //console.log(result); // Promise resolves to "bar"
      if (result == 1) {
        crumbs.get(req.params.uid, function (err, result) {
          if (err) {
            console.error(err);
            console.log(result);
            res.json({_err: err});
          } else {
            //req.query.
            result = JSON.parse(result)
            result._db.pop()
            result._last_modified = Math.round((new Date()).getTime() / 1000)
            if (result._db.length < 10000) {
              crumbs.set(req.params.uid, JSON.stringify(result));
              res.json({_last_modified_date: result._last_modified, _db_exp_time: result._db_time, db: result._db})
              console.log("accsesed: " + req.params.uid)
            } else if(result._db.length > 10000) {
              console.log(req.params.uid + " db has exeded size limit of 10000")
              res.json({_last_modified_date: result._last_modified, _db_exp_time: result._db_time, db: ["size limit reached of 10000"]})
            }
            console.log("accsesed: " + req.params.uid)
            if (result._db_time == "7d") {
              crumbs.expire(result._name, "604800");
            } else if (result._db_time == "30d") {
              crumbs.expire(result._name, "2592000");
            } else if (result._db_time == "inf") {
              console.log("somone accsed a 'inf' database with a uuid of: " + result._name)
            }
          }
        });
      } else if (result == 0) {
        res.json({err: "The DataBase Dosen't Exist"})
      }
    }
  });
});
app.get("/api/:uid/deleteall", (req, res) => {
  crumbs.exists(req.params.uid, function (err, result) {
    if (err) {
      console.error(err);
    } else {
      //console.log(result); // Promise resolves to "bar"
      if (result == 1) {
        crumbs.get(req.params.uid, function (err, result) {
          if (err) {
            console.error(err);
            console.log(result);
            res.json({_err: err});
          } else {
            //req.query.
            result = JSON.parse(result)
            result._db = []
            result._last_modified = Math.round((new Date()).getTime() / 1000)
            if (result._db.length < 10000) {
              crumbs.set(req.params.uid, JSON.stringify(result));
              res.json({_last_modified_date: result._last_modified, _db_exp_time: result._db_time, db: result._db})
              console.log("accsesed: " + req.params.uid)
            } else if(result._db.length > 10000) {
              console.log(req.params.uid + " db has exeded size limit of 10000")
              res.json({_last_modified_date: result._last_modified, _db_exp_time: result._db_time, db: ["size limit reached of 10000"]})
            }
            console.log("accsesed: " + req.params.uid)
            if (result._db_time == "7d") {
              crumbs.expire(result._name, "604800");
            } else if (result._db_time == "30d") {
              crumbs.expire(result._name, "2592000");
            } else if (result._db_time == "inf") {
              console.log("somone accsed a 'inf' database with a uuid of: " + result._name)
            }
          }
        });
      } else if (result == 0) {
        res.json({err: "The DataBase Dosen't Exist"})
      }
    }
  });
});
app.get("/api/:uid/updateoneonly", (req, res) => {
  var number = parseInt(req.query.location)
  var data = req.query.data
  crumbs.exists(req.params.uid, function (err, result) {
    if (err) {
      console.error(err);
    } else {
      //console.log(result); // Promise resolves to "bar"
      if (result == 1) {
        crumbs.get(req.params.uid, function (err, result) {
          if (err) {
            console.error(err);
            console.log(result);
            res.json({_err: err});
          } else {
            //req.query.
            result = JSON.parse(result)
            data = JSON.parse("{\"data\": " + data + "}")
            result._db[number] = data.data
            result._last_modified = Math.round((new Date()).getTime() / 1000)
            if (result._db.length < 10000) {
              crumbs.set(req.params.uid, JSON.stringify(result));
              res.json({_last_modified_date: result._last_modified, _db_exp_time: result._db_time, db: result._db})
              console.log("accsesed: " + req.params.uid)
            } else if(result._db.length > 10000) {
              console.log(req.params.uid + " db has exeded size limit of 10000")
              res.json({_last_modified_date: result._last_modified, _db_exp_time: result._db_time, db: ["size limit reached of 10000"]})
            }
            if (result._db_time == "7d") {
              crumbs.expire(result._name, "604800");
            } else if (result._db_time == "30d") {
              crumbs.expire(result._name, "2592000");
            } else if (result._db_time == "inf") {
              console.log("somone accsed a 'inf' database with a uuid of: " + result._name)
            }
          }
        });
      } else if (result == 0) {
        res.json({err: "The DataBase Dosen't Exist"})
      }
    }
  });
});
app.get("/getnew", (req, res) => {
  var uid1h = genUuid()
  var uid24h = genUuid()
  var uid7d = genUuid()
  var uid30d = genUuid()
  var uidinf = genUuid()
  setDb(uid1h, uid24h, uid7d, uid30d, uidinf)
  res.json({d7: uid7d, d30: uid30d})
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
        ret = true
      }
    }
  });
  if (ret = true) {
    return theuuid
  } else if (ret == false) {
    return genUuid()
  }
}
function setDb(h1, h24, d7, d30, inf) {
  //1 hour
  /*
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
  */
  //7 days
  crumbs.set(d7, JSON.stringify({
    _name: d7,
    _creation_date: Math.round((new Date()).getTime() / 1000),
    _last_modified: Math.round((new Date()).getTime() / 1000),
    _db_time: "7d",
    _db: []
  }));
  crumbs.expire(d7, "604800");
  //30 days
  crumbs.set(d30, JSON.stringify({
    _name: d30,
    _creation_date: Math.round((new Date()).getTime() / 1000),
    _last_modified: Math.round((new Date()).getTime() / 1000),
    _db_time: "30d",
    _db: []
  }));
  crumbs.expire(d30, "2592000");
  //infinate
  crumbs.set(inf, JSON.stringify({
    _name: inf,
    _creation_date: Math.round((new Date()).getTime() / 1000),
    _last_modified: Math.round((new Date()).getTime() / 1000),
    _db_time: "inf",
    _db: []
  }));
}