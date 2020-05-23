var sendForm = document.querySelector('#chatform'),
    textInput = document.querySelector('.chatbox'),
    chatList = document.querySelector('.chatlist'),
    userBubble = document.querySelectorAll('.userInput'),
    botBubble = document.querySelectorAll('.bot__output'),
    animateBotBubble = document.querySelectorAll('.bot__input--animation'),
    overview = document.querySelector('.chatbot__overview'),
    hasCorrectInput,
    imgLoader = false,
    animationCounter = 1,
    animationBubbleDelay = 600,
    input,
    previousInput,
    isReaction = false,
    unkwnCommReaction = "I didn't quite get that.",
    chatbotButton = document.querySelector(".submit-button"),
    firstno="",
    url="http://salty-shelf-45512.herokuapp.com",
    chain = false,
    prev_q = -1,
    lang,
    lang1
sendForm.onkeydown = function(e){
  if(e.keyCode == 13){
    e.preventDefault();

    //No mix ups with upper and lowercases
    var input = textInput.value.toLowerCase();

    //Empty textarea fix
    if(input.length > 0) {
      createBubble(input)
    }
  }
};

sendForm.addEventListener('submit', function(e) {
  //so form doesnt submit page (no page refresh)
  e.preventDefault();

  //No mix ups with upper and lowercases
  var input = textInput.value.toLowerCase();

  //Empty textarea fix
  if(input.length > 0) {
    createBubble(input)
  }
}) //end of eventlistener

var createBubble = function(input) {
  //create input bubble
  var chatBubble = document.createElement('li');
  chatBubble.classList.add('userInput');

  //adds input of textarea to chatbubble list item
  chatBubble.innerHTML = input;

  //adds chatBubble to chatlist
  chatList.appendChild(chatBubble)
  chatList.scrollTop = chatList.scrollHeight;
  checkInput(input);
}

var checkInput = function(input) {
  
  var reply ="";
  lang = document.querySelector('.active').innerHTML
  if(lang=="English"){
    lang1="en"
   }
  else if(lang=="Hindi(हिीन्द)"){
    lang1="hi"
  }
  else if(lang=="Kannada(ಕನ್ನಡ)"){
    lang1="kn"
  }else if(lang=="Tamil(தமிழ்)"){
    
    lang1="tn"
  }
  else if(lang=="Telugu(తెలుగు)"){
    
    lang1="te"
  }
  else if(lang=="Malyalam(മല്യാലം)"){
    
    lang1="ml"
  }
  console.log(input)
  
  if(input==1||input==2||input==3||input==4||input==5){
   firstno=input;
   
   
   if(lang=="English"){
    console.log(chain)
    botResponse("go on with your question",chain)
    lang1="en"
   }
  else if(lang=="Hindi(हिीन्द)"){
    botResponse("अपना सवाल पूछें",chain)
    lang1="hi"
  }
  else if(lang=="Kannada(ಕನ್ನಡ)"){
    botResponse("ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಕೇಳಿ",chain)
    lang1="kn"
  }
  else if(lang=="Tamil(தமிழ்)"){
    botResponse("உங்கள் கேள்வியுடன் செல்லுங்கள்",chain)
    lang1="tn"
  }
  else if(lang=="Telugu(తెలుగు)"){
    botResponse("మీ ప్రశ్నతో కొనసాగండి",chain)
    lang1="te"
  }
  else if(lang=="Malyalam(മല്യാലം)"){
    botResponse("നിങ്ങളുടെ ചോദ്യവുമായി തുടരുക",chain)
    lang1="ml"
  }
  
  
  }else{
    if(firstno==""){
      console.log(lang1)
      if(lang1=="en"){
        
        botResponse("choose one of the above options first",chain)
        
       }
      else if(lang1=="hi"){
        
        botResponse("उपरोक्त विकल्पों में से कोई एक चुनें",chain)
        
      }
      else if(lang1=="kn"){
        
        botResponse("ಮೇಲಿನ ಆಯ್ಕೆಗಳಲ್ಲಿ ಒಂದನ್ನು ಮೊದಲು ಆರಿಸಿ",chain)
        
      }
      else if(lang1=="te"){
        
        botResponse("మొదట పై ఎంపికలలో ఒకదాన్ని గొట్టం చేయండి",chain)
        
      }
      else if(lang1=="tn"){
        
        botResponse("மேலே உள்ள விருப்பங்களில் ஒன்றை முதலில் குழாய்",chain)
        
      }
      else if(lang1=="ml"){
        
        botResponse("ആദ്യം മുകളിലുള്ള ഓപ്ഷനുകളിലൊന്ന് ഹോസ് ചെയ്യുക",chain)
        
      }

    }else{
      api(url,input,firstno)
    }
    
  }
}


function api(url,input,firstno){
  console.log(prev_q)
  fetch('/chat?url='+url+"&&input="+input+"&&firstno="+firstno+"&&lang="+lang1+"&&chain="+chain+"&&prev_q="+prev_q).then((res)=>{
    res.json().then((data)=>{console.log(data.totalInfo.answer)
      if(data.totalInfo.chain){
        prev_q=data.totalInfo.question_id
        chain = data.totalInfo.chain
        
        botResponse(data.totalInfo.answer,data.totalInfo.chain)
        
          console.log(lang1)
          if(lang1=="en"){
            botResponse(" answer in Yes or No ",chain)
          }
          else if(lang1=="hi"){
            botResponse(" Yes(हां) या No(ना) में जवाब दें ",chain)
          }
          else if(lang1=="kn"){
            botResponse(" yes(ಹೌದು) ಅಥವಾ No(ಇಲ್)ಲ ಎಂದು ಉತ್ತರಿಸಿ ",chain)
            }
            else if(lang1=="te"){
              botResponse(" yes(అవును) లేదా no(కాదు) అని సమాధానం ఇవ్వండి",chain)
            }
            else if(lang1=="tn"){
                botResponse(" yes(ஆம்) அல்லது no(இல்லை) என்ற பதிலில் பதிலளிக்கவும் ",chain)
            }
            else if(lang1=="ml"){
                botResponse(" yes(അതെ) അല്ലെങ്കിൽ no(ഇല്ല) എന്ന് ഉത്തരം നൽകുക",chain)
            }
        
      }else{
        prev_q=data.totalInfo.question_id
      chain = data.totalInfo.chain
    botResponse(data.totalInfo.answer,data.totalInfo.chain)
      }
    })
  })
  

}
// debugger;

function botResponse(textVal,chain) {
  //sets previous input to that what was called
  // previousInput = input;

  //create response bubble
  var chatBubble = document.createElement('li');
  chatBubble.classList.add('new');
  
  chatBubble.innerHTML = textVal
  

  //adds chatBubble to chatlist
  chatList.appendChild(chatBubble) //adds chatBubble to chatlist
      console.log(chatList)
  // reset text area input
  chatList.scrollTop = chatList.scrollHeight;
  
    textInput.value = "";
  
  
}

function unknownCommand(unkwnCommReaction) {
  // animationCounter = 1;

  //create response bubble
  var failedResponse = document.createElement('li');

  failedResponse.classList.add('bot__output');
  failedResponse.classList.add('bot__output--failed');

  //Add text to failedResponse
  failedResponse.innerHTML = unkwnCommReaction; //adds input of textarea to chatbubble list item

  //add list item to chatlist
  chatList.appendChild(failedResponse) //adds chatBubble to chatlist

  animateBotOutput();

  // reset text area input
  textInput.value = "";

  //Sets chatlist scroll to bottom
  chatList.scrollTop = chatList.scrollHeight;

  animationCounter = 1;
}

function responseText(e) {

  var response = document.createElement('li');

  response.classList.add('bot__output');

  //Adds whatever is given to responseText() to response bubble
  response.innerHTML = e;

  chatList.appendChild(response);

  animateBotOutput();

  console.log(response.clientHeight);

  //Sets chatlist scroll to bottom
  setTimeout(function(){
    chatList.scrollTop = chatList.scrollHeight;
    console.log(response.clientHeight);
  }, 0)
}

function responseImg(e) {
  var image = new Image();

  image.classList.add('bot__output');
  //Custom class for styling
  image.classList.add('bot__outputImage');
  //Gets the image
  image.src = "/images/"+e;
  chatList.appendChild(image);

  animateBotOutput()
  if(image.completed) {
    chatList.scrollTop = chatList.scrollTop + image.scrollHeight;
  }
  else {
    image.addEventListener('load', function(){
      chatList.scrollTop = chatList.scrollTop + image.scrollHeight;
    })
  }
}

//change to SCSS loop
function animateBotOutput() {
  chatList.lastElementChild.style.animationDelay= (animationCounter * animationBubbleDelay)+"ms";
  animationCounter++;
  chatList.lastElementChild.style.animationPlayState = "running";
}

function commandReset(e){
  animationCounter = 1;
  previousInput = Object.keys(possibleInput)[e];
}

// hlep

var possibleInput = {
  // "hlep" : this.help(),
  "help" : function(){
    responseText("You can type a command in the chatbox")
    responseText("Something like &quot;Navvy, please show me Mees&rsquo; best work&quot;")
    responseText("Did you find a bug or problem? Tweet me @MeesRttn")
    commandReset(0);
    return
    },
  "best work" : function(){
    responseText("I will show you Mees' best work!");
    responseText("These are his <a href='#animation'>best animations</a>")
    responseText("These are his <a href='#projects'>best projects</a>")
    responseText("Would you like to see how I was built? (Yes/No)")
    commandReset(1);
    return
    },
  "about" : function(){
    responseText("This is me, Navvy's maker, Mees Rutten");
    responseText("I'm a 22 year old Communication and Multimedia Design student");
    responseText("My ambition is to become a great Creative Front-End Developer");
    responseText("Would you like to know about Mees' vision? (Yes/No)");
    commandReset(2);
    return
    },
  "experience" : function(){
    responseText("Mees has previously worked at:");
    responseText("Cobra Systems as web- developer / designer");
    responseText("BIT Students as web- developer / designer");
    responseText("MediaMonks as a junior Front-end Developer");
    commandReset(3);
    return
  },
  "hobbies" : function(){
    responseText("Mees loves:");
    responseText("Coding complicated chatbots");
    responseText("Family time");
    responseText("Going out with friends");
    responseText("Working out");
    commandReset(4);
    return
  },
  "interests" : function(){
    responseText("Mees loves:");
    responseText("Coding complicated chatbots");
    responseText("Family time");
    responseText("Going out with friends");
    responseText("Working out");
    commandReset(5);
    return
  },
  "vision" : function(){
    responseText("Things I want to learn or do:");
    responseText("Get great at CSS & JS animation");
    responseText("Create 3D browser experiences");
    responseText("Learn Three.js and WebGL");
    responseText("Combine Motion Design with Front-End");
    commandReset(6);
    return
  },
  "contact" : function(){
    responseText("email: <a href='mailto:meesrutten@gmail.com?Subject=Hello%20Mees' target='_top'>send me a message</a>");
    responseText("Twitter: <a href='https://twitter.com/meesrttn'>@MeesRttn</a>");
    commandReset(7);
    return
  },
  "commands" : function(){
    responseText("This is a list of commands Navvy knows:")
    responseText("help, best work, about, vision, experience, hobbies / interests, contact, rick roll");
    commandReset(8);
    return
  },
  "rick roll" : function(){
    window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
  // work experience
}

var reactionInput = {
  "best work" : function(){
    //Redirects you to a different page after 3 secs
    responseText("On this GitHub page you'll find everything about Navvy");
    responseText("<a href='https://github.com/meesrutten/chatbot'>Navvy on GitHub</a>")
    animationCounter = 1;
    return
  },
  "about" : function(){
    responseText("Things I want to learn or do:");
    responseText("Get great at CSS & JS animation");
    responseText("Create 3D browser experiences");
    responseText("Learn Three.js and WebGL");
    responseText("Combine Motion Design with Front-End");
    animationCounter = 1;
    return
    }
}
