# Multilingual Chatbot

### What's our idea?

Our idea is to build a multilingual chatbot which can be implemented over different development environments. 

### What will this improve?

A chatbot which can talk in more than one language finds itself useful to developers who are targeting to develop an mobile or web application which requires customer care services and which has the users from large geographical area. The support for multiple languages can be very user friendly as the users can interact with their language of choice.

---

### Approach:
Our approach for multilingual chat bot model includes an API which takes user question as an input, tries to understand and delivers a proper reply for the question user asks as an output. Primary goal is to include as many regional languages of India as possible.

The type of chat bot that we are building is retrieval type chat bot or rule based chat bot. The replies are not generated runtime but are fetched from database which holds previously determined reply strings. The reason we chose on building a rule based chat bot is because of the domain we chose. The answers are mostly descriptive and are to be stored in database. 

---

### Architecture:

The model consists of following components:
1) A front end for user interactions.
2) A managing API which takes care of translation and categorizing, any changes on functionality of the API can be done here.
3) A chat bot API which domain specific, which takes care of natural language processing.
4) A database to store replies for the questions asked.

The working of this model is as follows:
1) Front-end can be designed as both a mobile application or a website.
2) The user string can be any of the languages mentioned later. The language of the string can be detected automatically but the drawback is that the accuracy decreases and also there may be an error if the user uses a language that is not supported by our API. The user chooses the language that he likes to give the input in and the output will be in the same corresponding language.
3) In the API, the input is further translated to English from their corresponding languages to simplify the computations. 
4) This translated string is further fed into a neural network which takes care of prediction. 
5) This machine learning model returns back a reply after understanding what the user has asked. 
6) These replies and previously stored in a database in different languages supported and fetched accordingly.
7) The replies are sent back in the language chosen to the application or website that posted the question string. 

Languages Supported:
1. English
2. Kannada
3. Tamil
4. Malayalam
5. Telugu
6. Hindi

Planning to extend to more regional languages soon

---

### Domain:

As building a general chat bot is very hard a suitable domain for the chat bot has been chosen. The domain we chose for the chat bot is COVID-19 outbreak. 
We designed a chat bot which answers any questions related to following topics.
1. Symptoms of the disease.
2. Modes of disease spread.
3. Precautions to be taken.
4. Cures 
5. About corona virus
 

#### What are the types questions that can be asked?
Questions can broadly classified into two kinds. First one is descriptive questions(Example: "What is COVID-19?") where the questions asked by the user has a unique descriptive answer. These kinds of questions are easier to handle. The second type of questions require chained replies(Example: "I visited hospital. Are there chances of me getting infected?"). This means in some particular types of questions, the answer can be only given after analyzing the situation the user is in. So once such question is asked, we will have to ask a few questions back to the user to get details on his current situation and only then a proper answer can be given.

---
### This repository includes following contents:

* Chatbot JavaScript Website
* Chatbot Flutter Mobile Application
* Node API (For Translation)
* Flask API (For Machine Learning)

---


# Flask API

> To train the api to answer custom questions change the json files inside Categories file and train the bot.

___

**Requirements**

* Python 3.6
* Tensorflow 1.14
* Nltk
* Flask
* Redis Database (Include config file for getting url port and password for database)

---

> To setup environment in anaconda:

```Bash
    conda create -n chatbot python=3.6
    activate chatbot
```

>Install modules:
```Bash
    pip install -r requirements.txt
```

>Run server:
```Bash
    flask run
```
> Config file:
```python
    def cred():
        redis = {
            'host' : "host url", 
            'port' : 'port number', 
            'password' : 'password'
        }
        return redis
```