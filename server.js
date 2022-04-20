'use strict';

const port = 3000;
const fs = require('fs');

const express = require('express');
const app = express();

app.use(express.static("public"))

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.json());

app.get('/api/db',function(req,res){
    fs.readFile("db.json",function(err,data){
        if(err) res.status(500).send("Server Error");
        res.send(data);
    });
})
app.post('/api/db',function(req,res,next){
    //Save req.body to db.json
    fs.writeFile("db.json",JSON.stringify(req.body,null, "\t"),function(err){
        if(err){
            console.log(err);
            fs.close();
        }
    });
    res.sendStatus(200);
})

app.listen(port,function(){
    console.log("Port:3000");
})

