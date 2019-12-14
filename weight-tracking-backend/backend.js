let express = require('express');
let bodyParser = require("body-parser")
let mongodb = require('mongodb');
//db connection url
const url = 'mongodb://localhost:27017'
//db name
const dbName = 'weightTracker'
var db
mongodb.MongoClient.connect(url, function (err, client) {
    if (err == null) {
        console.log("connected successfully to db server");
        db = client.db(dbName);

    }
})
let app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());
app.post('/addNew', function (req, res) {

    db.collection("names").insertOne(req.body, function (err, res) {
        if (err) {
            console.log(err)
        } else {
            console.log(req.body.name + " inserted")
        }
    })
})
app.get('/checkName', function (req, resp) {
    console.log("checkName request recived for: " + req.query.name)
    let name;
    db.collection("names").findOne({ name: req.query.name }, function (err, res) {
        if (err) {
            console.log("test not found")
        } else {
            // console.log(req.query.name);

            console.log("res is: " + res)
            // name = res;
            // let data = data
            if (res == null) {
                resp.send({ data: false })
                console.log("null sent")
            } else {
                let obj = JSON.parse(JSON.stringify(res));
                resp.send(obj)
            }
        }
    })

})
app.get("/loadData", function (req, res) {
    db.collection("names").findOne({ name: req.query.name }, function (err, ress) {
        if (err) {
            console.log("loadData error: " + err);
        } else {
            res.send(ress);
        }
    })
})

app.post("/setdata", function (req, res) {
    db.collection("names").update({ name: req.body.name }, { name: req.body.name, age: req.body.age, gender: req.body.gender, weights: req.body.weights }, function (err, res) {
        if (err) {
            console.log("UPdate error" + err)
        } else {
            console.log(req.body.name + "updated")
        }
    })
})
app.post("/addWeight", function (req, resp) {
    db.collection("names").update({ name: req.body.name }, { $set: { weights: req.body.weights } })
})
app.listen(5000, () => console.log('listinging on port 5000'))