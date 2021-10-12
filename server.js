'use strict';

const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const server = express();
server.use(cors());
server.use(express.json());

const PORT=process.env.PORT || 3010;

// Mongo DB stuff
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let ModalLanguage;

// Routes
server.get('/', homeHandler);
server.get('/getData', GetDataHandler);
server.post('/addToFav', AddToFavHandler);
server.get('/getFavData', GetFavDataHandler);
server.delete('/deleteItem/:id/:email', DeleteItemHandler);
server.put('/updateData/:id', UpdateDataHandler);

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/301Retake');

  const LangSchema = new Schema({
    title: String,
    dateCreated: String,
    description: String,
    imageUrl: String,
    email: String
  });
  ModalLanguage=mongoose.model("Programming", LangSchema );
}

// Functions Handlers
function homeHandler(req,res){
    res.send('Home Page')
};

function GetDataHandler(req,res){
    const url='https://ltuc-asac-api.herokuapp.com/programmingLangData';
    axios
    .get(url)
    .then(result=>{
        res.send(result.data)
    })
    .catch(err=>{
        console.log(err);
    });
};

function AddToFavHandler(req,res){
    const {title,dateCreated,description,imageUrl,email}=req.body;

    ModalLanguage.create({title,dateCreated,description,imageUrl,email},(err,result)=>{
        if(err){
            console.log(err)
        }
        else{
            res.send(result)
        };
    });
};

function GetFavDataHandler (req,res){
    const email = req.query.email;

    ModalLanguage.find({email:email},(err,result)=>{
        if(err){
            console.log(err)
        }
        else{
            res.send(result)
        };
    })
};

function DeleteItemHandler (req,res){
    const id = req.params.id;
    const email= req.params.email;

    ModalLanguage.deleteOne({_id:id},(err,result)=>{
        if(err){
            console.log(err);
        };
    });
    ModalLanguage.find({email:email},(err,result)=>{
        if(err){
            console.log(err)
        }
        else{
            res.send(result)
        };
    });
};

function UpdateDataHandler(req,res){
    const id = req.params.id;
    const {langTitle,langDate,langDescrib,langImage,email}=req.body;
    console.log(req.body)

    ModalLanguage.findByIdAndUpdate(id, {title:langTitle, dateCreated: langDate, description:langDescrib, imageUrl:langImage}, (err,result)=>{
        ModalLanguage.find({email:email},(err,result)=>{
            if(err){
                console.log(err)
            }
            else{
                console.log(result)

                res.send(result)
            };
        });
    });

};

// Check if Listening
server.listen(PORT,()=>{
    console.log(`Listening on ${PORT}`)
});

