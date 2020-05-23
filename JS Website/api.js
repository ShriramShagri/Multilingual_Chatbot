var allInfo = (url,input,firstno,lang,chain1,prev_q,callback)=>{
    console.log(url+" "+lang+" "+chain1+prev_q)
    if(chain1=="true"){
      chain = true //to make it boolean from string
      
    }else{
      chain= false
      
    }
    var body = {
      "language":lang,
      "category":firstno,
      "question":input,
      "chain": chain,
      "previous_question": prev_q
    }
    console.log(body)
    var request = require("request");
    var options = {
      method: 'POST',
      url: url,
      body:body,
      json : true,
    };
    
    var totalInfo = Array() 
    request(options, function (err, res) {
      if(err){
        callback('unable to connect to the internet -.- ',undefined)
    }else{
        
      callback(undefined,{ totalInfo:res.body})
  
        }
        
    })
}
module.exports = allInfo