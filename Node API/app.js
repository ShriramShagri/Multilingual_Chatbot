const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var request = require('request');
const translate = require('@vitalets/google-translate-api');
const mongoose=require('mongoose');
const Precaution = require("./models/precaution");
const Symptom = require("./models/symptom");


app.use(bodyParser.urlencoded({extended: "false"}));
app.use(bodyParser.json());

var option={};

mongoose.connect('mongodb+srv://chatbot:api@cluster0-2iquv.mongodb.net/test?retryWrites=true&w=majority',{
    // useMongoClient: true
    useUnifiedTopology: true,
	useNewUrlParser: true,
	useCreateIndex: true
}).then(()=>{
	console.log("Connected to db");
}).catch(err=>{
	console.log("error:", err.message);
});

mongoose.Promise=global.Promise;


app.get('/language',(req,res,next) => {
    request({
        url:'https://tranquil-fortress-60933.herokuapp.com/language',
        method: 'GET',
    } ,function(error,resp, body){
            if(!error && resp.statusCode == 200){
                 var body= JSON.parse(body);
               var language = body.language;
                res.status(200).json({
                language
            });
        }
    })
});

app.get('/category',(req,res,next) => {
    var lang = req.query.lang;
    console.log(lang)
    request({
        url:'https://tranquil-fortress-60933.herokuapp.com/category?lang='+lang,
        method: 'GET',
    } ,function(error,resp, body){
            if(!error && resp.statusCode == 200){
                 var body= JSON.parse(body);
               var category = body.category;
                res.status(200).json({
                category
            });
        }
    })
});


// app.post('/symptoms',(req,res,next) => {
// const product = new Symptom({
//     _id: new mongoose.Types.ObjectId(),
//     ques: req.body.ques,
//     num: req.body.num
//   });
//   product
//     .save()
//     .then(result => {
//       console.log(result);
//       res.status(201).json({
//         message: "Handling POST requests to /products",
//         createdProduct: {
//           num: result.num,
//           ques: result.ques,
//           _id: result._id
//         }
//       });
//     })
//     .catch(err =>{
//         console.log(err);
//         res.status(500).json({
//             error: err
//         });
//     });
// });

// app.post('/precautions',(req,res,next) => {
//     const product = new Precaution({
//         _id: new mongoose.Types.ObjectId(),
//         ques: req.body.ques,
//         num: req.body.num
//       });
//       product
//         .save()
//         .then(result => {
//           console.log(result);
//           res.status(201).json({
//             message: "Handling POST requests to /products",
//             createdProduct: {
//               num: result.num,
//               ques: result.ques,
//               _id: result._id
//             }
//           });
//         })
//         .catch(err =>{
//             console.log(err);
//             res.status(500).json({
//                 error: err
//             });
//         });
//     });

app.post('/',(req,res,next) => {

    option.language = req.body.language;
    option.ques = req.body.question;
    option.category = req.body.category;
    option.chain = req.body.chain;
    option.previous_question = req.body.previous_question;

   
    
        translate(option.ques, {to: 'en'}).then(response => {
            console.log(response.text);
            console.log(response.from.language.iso);

            var i;
                if(option.language == "en")
                i=0;
                else if(option.language == "kn")
                i=1;
                else if(option.language == "hi")
                i=2;
                else if(option.language == "te")
                i=3;
                else if(option.language == "ta")
                i=4;
                else if(option.language == "ml")
                i=5;

            if(option.chain == "true")
            {  
                var n = 2*option.previous_question;
                var m = 2*option.previous_question+1;
                n.toString();
                m.toString();

                option.ques.toLowerCase();
                if(option.category == "1"){
                         if(option.ques == 'yes'){
                             console.log(n)
                            Symptom.find({num:n})
                             .exec()
                             .then(doc => {
                                 console.log("From database",doc);
                             if(doc.length > 0) { 
                                 if(option.previous_question < 16){
                                    res.status(200).json({
                                        "answer" : doc[0].ques[i],
                                        "question_id" : (2*option.previous_question).toString() ,
                                        "chain" : "true"
                                        });
                                 } else {
                                    res.status(200).json({
                                        "answer" : doc[0].ques[i],
                                        "chain" : "false",
                                        "question_id" : "-1"
                                        });
                                 }         
                             } else {
                                res.status(401).json({
                                    "answer" : "Error : Incorrect previous question number.",
                                    "chain" : "false",
                                    "question_id" :"-1"
                                    });
                            }
                              })
                         } else if(option.ques == 'no'){
                            Symptom.find({num:m})
                             .exec()
                             .then(doc => {
                                 console.log("From database",doc);
                             if(doc.length > 0) {
                                if(option.previous_question < 16){
                                    res.status(200).json({
                                        "answer" : doc[0].ques[i],
                                        "question_id" : (2*option.previous_question+1).toString() ,
                                        "chain" : "true"
                                        });
                                 } else {
                                    res.status(200).json({
                                        "answer" : doc[0].ques[i],
                                        "chain" : "false",
                                        "question_id" : "-1"
                                        });
                                 }
                             } else {
                                res.status(401).json({
                                    "answer" : "Error : Incorrect previous question number.",
                                    "chain" : "false",
                                    "question_id" :"-1"
                                    });
                            }
                              })
                         } else {
                            res.status(422).json({
                                "answer" : "Incorrect answer. Please give yes or no as answer.",
                                "chain" : "false",
                                "question_id" :"-1"
                                });

                         }
         } else if(option.category == "3"){
                                if(option.ques == 'yes'){
                                    console.log(n)
                                Precaution.find({num:n})
                                .exec()
                                .then(doc => {
                                    console.log("From database",doc);
                                if(doc.length > 0) { 
                                    if(option.previous_question < 16){
                                    res.status(200).json({
                                        "answer" : doc[0].ques[i],
                                        "question_id" : (2*option.previous_question).toString() ,
                                        "chain" : "true"
                                        });
                                    } else {
                                    res.status(200).json({
                                        "answer" : doc[0].ques[i],
                                        "chain" : "false",
                                        "question_id" : "-1"
                                        });
                                    }         
                                } else {
                                    res.status(401).json({
                                        "answer" : "Error : Incorrect previous question number.",
                                        "chain" : "false",
                                        "question_id" :"-1"
                                        });
                                }
                                })
                         } else if(option.ques == 'no'){
                                Precaution.find({num:m})
                                .exec()
                                .then(doc => {
                                    console.log("From database",doc);
                                if(doc) {
                                    if(option.previous_question < 16){
                                        res.status(200).json({
                                            "answer" : doc[0].ques[i],
                                            "question_id" : (2*option.previous_question+1).toString() ,
                                            "chain" : "true"
                                            });
                                        } else {
                                        res.status(200).json({
                                            "answer" : doc[0].ques[i],
                                            "chain" : "false",
                                            "question_id" :"-1"
                                            });
                                        }
                                    } else {
                                        res.status(401).json({
                                            "answer" : "Error : Incorrect previous question number.",
                                            "chain" : "false",
                                            "question_id" :"-1"
                                            });
                                    }
                                    })
                                } else {
                       res.status(401).json({
                           "answer" : "Incorrect answer. Please give yes or no as answer.",
                           "chain" : "false",
                           "question_id" : "-1"
                           });

                    }
           } else {
            Symptom.find({num: "999"})
            .exec()
            .then(doc => {
                console.log("From database",doc);
            if(doc.length > 0) {
                   res.status(200).json({
                       "answer" : doc[0].ques[i],
                       "question_id" : "-1" ,
                       "chain" : "false"
                       });
                }
             })
           }

     } else {
                request({
                        url:'https://tranquil-fortress-60933.herokuapp.com/'+option.category,
                        method: 'POST',
                        json: {"ques" : response.text, 
                               "lang" : option.language
                             }
                    } ,function(error,resp, body){
                            if(error){
                                console.log(error)
                                res.status(401).json({
                                    "answer" : "Error : " + error,
                                    "chain" : "false",
                                    "question_id" :"-1"
                                    });     
                            } else 
                            if(!error && resp.statusCode == 200){
                                console.log(body);
                                

                                if(body.chain == true)
                                {    
                                    if(option.category == "1"){
                                       if(option.previous_question == "-1"){
                                        Symptom.find({num:"1"})
                                        .exec()
                                        .then(doc => {
                                            console.log("From database",doc);
                                            if(doc) {
                                                res.status(200).json({
                                                   "answer" : doc[0].ques[i],
                                                   "question_id" : "1",
                                                   "chain" : "true"
                                                });
                                            } else{
                                                res.status(401).json({
                                                    "answer" : "Error : Incorrect previous question number.",
                                                    "chain" : "false",
                                                    "question_id" :"-1"
                                                    });
                                            }
                                         })
                                        }
                                    }
                                 else if(option.category == "3"){
                                    if(option.previous_question == "-1"){
                                        console.log("in")
                                     Precaution.find({num:"1"})
                                     .exec()
                                     .then(doc => {
                                         console.log("From database",doc);
                                         if(doc) {
                                             res.status(200).json({
                                                "answer" : doc[0].ques[i],
                                                "question_id" : "1",
                                                "chain" : "true"
                                             });
                                         } else {
                                            res.status(401).json({
                                                "answer" : "Error : Incorrect previous question number.",
                                                "chain" : "false",
                                                "question_id" :"-1"
                                                });
                                         }
                                      })
                                     }
                                 }
                                }
                              
                            else {
                                res.status(201).json({
                                        "answer": body.reply,
                                        "chain" : "false",
                                        "question_id" : "-1"
                                 });
                            }  
                        }  
                    }
                    
                )
             }
        }).catch(err => {
            console.error(err);
            res.status(401).json({
                "answer" : "Error : Translation failed" + err,
                "chain" : "false",
                "question_id" :"-1"
                });
        });
    

})
    

module.exports = app;