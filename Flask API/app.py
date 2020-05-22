from flask import Flask, jsonify, request, make_response
import jwt
from functools import wraps
import nltk
from nltk.stem.lancaster import LancasterStemmer
import numpy
import tflearn
import tensorflow 
import random
import json
import pickle
import redis
import config



class Chatbot():
    def __init__(self, category):

        redisUser = config.cred()
        self.redisClient = redis.Redis(host=redisUser['host'], port=redisUser['port'], password= redisUser['password'])

        self.stemmer = LancasterStemmer()
        self.category = category

        with open(f"./Category{self.category}/ques.json", encoding="utf-8") as file:
            self.data = json.load(file)
        
        try:
            r
            with open(f"Category{self.category}/data.pickle","rb") as f:
                self.words, self.labels, self.training, self.output = pickle.load(f)

        except:
            self.words = []
            self.labels = []
            self.docs_x = []
            self.docs_y = []

            for intent in self.data["intents"]:
                for pattern in intent["pattern"]:
                    wrds = nltk.word_tokenize(pattern)
                    self.words.extend(wrds)
                    self.docs_x.append(wrds)
                    self.docs_y.append(intent["tag"])

                if intent["tag"] not in self.labels:
                    self.labels.append(intent["tag"])

            self.words = [self.stemmer.stem(w.lower()) for w in self.words if w not in "?"]
            self.words = sorted(list(set(self.words)))

            self.labels = sorted(self.labels)

            self.training = []
            self.output = []

            self.out_empty = [0 for _ in range(len(self.labels))]

            for x, doc in enumerate(self.docs_x):
                bag = []

                wrds = [self.stemmer.stem(w) for w in doc]

                for w in self.words:
                    if w in wrds:
                        bag.append(1)
                    else:
                        bag.append(0)
                
                self.output_row = self.out_empty[:]
                self.output_row[self.labels.index(self.docs_y[x])] = 1

                self.training.append(bag)
                self.output.append(self.output_row)


            self.training = numpy.array(self.training)
            self.output = numpy.array(self.output)

            with open(f"Category{self.category}/data.pkl","wb") as f:
                pickle.dump((self.words, self.labels, self.training, self.output), f)

        tensorflow.reset_default_graph()

        if self.category == 1:
            net = tflearn.input_data(shape=[None, len(self.training[0])])
            net = tflearn.fully_connected(net, 50)
            net = tflearn.fully_connected(net, 50)
            net = tflearn.fully_connected(net, len(self.output[0]),activation="softmax")
            net = tflearn.regression(net)

            self.model = tflearn.DNN(net)

            # self.model.fit(self.training, self.output, n_epoch=500, batch_size=8, show_metric=True)
            # self.model.save(f"./Category{self.category}/chatbot.tflearn")

        elif self.category == 2:
            net = tflearn.input_data(shape=[None, len(self.training[0])])
            net = tflearn.fully_connected(net, 50)
            net = tflearn.fully_connected(net, 50)
            net = tflearn.fully_connected(net, len(self.output[0]),activation="softmax")
            net = tflearn.regression(net)

            self.model = tflearn.DNN(net)

            # self.model.fit(self.training, self.output, n_epoch=500, batch_size=8, show_metric=True)
            # self.model.save(f"./Category{self.category}/chatbot.tflearn")

        elif self.category == 3:
            net = tflearn.input_data(shape=[None, len(self.training[0])])
            net = tflearn.fully_connected(net, 50)
            net = tflearn.fully_connected(net, 50)
            net = tflearn.fully_connected(net, len(self.output[0]),activation="softmax")
            net = tflearn.regression(net)

            self.model = tflearn.DNN(net)

            # self.model.fit(self.training, self.output, n_epoch=850, batch_size=8, show_metric=True)
            # self.model.save(f"./Category{self.category}/chatbot.tflearn")


        elif self.category == 4:
            net = tflearn.input_data(shape=[None, len(self.training[0])])
            net = tflearn.fully_connected(net, 50)
            net = tflearn.fully_connected(net, 50)
            net = tflearn.fully_connected(net, len(self.output[0]),activation="softmax")
            net = tflearn.regression(net)

            self.model = tflearn.DNN(net)

            # self.model.fit(self.training, self.output, n_epoch=850, batch_size=8, show_metric=True)
            # self.model.save(f"./Category{self.category}/chatbot.tflearn")

        elif self.category == 5:
            net = tflearn.input_data(shape=[None, len(self.training[0])])
            net = tflearn.fully_connected(net, 50)
            net = tflearn.fully_connected(net, 50)
            net = tflearn.fully_connected(net, len(self.output[0]),activation="softmax")
            net = tflearn.regression(net)

            self.model = tflearn.DNN(net)

            # self.model.fit(self.training, self.output, n_epoch=500, batch_size=8, show_metric=True)
            # self.model.save(f"./Category{self.category}/chatbot.tflearn")

        # try:
        self.model.load(f"./Category{self.category}/chatbot.tflearn")
        #     self.loaded = pickle.load(open(f"./Category{self.category}/model.pkl", 'rb'))
        # except:
        # self.model.fit(self.training, self.output, n_epoch=500, batch_size=8, show_metric=True)
        # self.model.save(f"./Category{self.category}/chatbot.tflearn")
        # pickle.dump(self.model, open(f"./Category{self.category}/model.pkl", 'wb'))
        
        
    def _bag_of_words(self, s, words):
        bag = [0 for _ in range(len(words))]

        s_words = nltk.word_tokenize(s)
        s_words = [self.stemmer.stem(word.lower()) for word in s_words]

        for se in s_words:
            for i, w in enumerate(words):
                if w == se:
                    bag[i] = 1

        return numpy.array(bag)


    def get_data(self, tag, lang):
        a = self.redisClient.hgetall(f'{self.category}:{tag}:{lang}')
        x = {y.decode('ascii'): a.get(y).decode('utf-8') for y in a.keys()}
        return x

    def prediction(self, s, lang):
        res = self.model.predict([self._bag_of_words(s,self.words)])[0]
        res_index = numpy.argmax(res)
        tag = self.labels[res_index]
        chain = False

        if res[res_index] > 0.7:
            responses = self.get_data(tag, lang)
            for tg in self.data["intents"]:
                if tg['tag'] == tag:
                    if tg["context_set"] is "1":
                        chain = True
                    else:
                        chain = False
            responses['chain'] = chain
            return responses
        else:
            a = self.redisClient.hgetall(f'custom:{lang}')
            x = {y.decode('ascii'): a.get(y).decode('utf-8') for y in a.keys()}
            x['chain'] = chain
            return x


app = Flask(__name__)

category = {'en': [
    {"category_id":1, "category_name":"Symptoms", "category_url": 'https://hotemoji.com/images/emoji/4/tgkksjy74i44.png'},
    {"category_id":2, "category_name":"Modes of disease spread", "category_url":'https://hotemoji.com/images/emoji/e/1gqjxj8a6hhe.png'},
    {"category_id":3, "category_name":"Precautions", "category_url":'https://latestchika.com/wp-content/uploads/2020/03/handwash-1068x620.png'},
    {"category_id":4, "category_name":"Cures", "category_url" : 'https://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/pill.png'},
    {"category_id":5, "category_name":"About Corona", "category_url": 'https://www.statnews.com/wp-content/uploads/2020/02/Coronavirus-CDC-768x432.jpg'}
],'kn': [
    {"category_id":1, "category_name":"ಲಕ್ಷಣಗಳು", "category_url": 'https://hotemoji.com/images/emoji/4/tgkksjy74i44.png'},
    {"category_id":2, "category_name":"ರೋಗ ಹರಡುವ ವಿಧಾನಗಳು","category_url":'https://hotemoji.com/images/emoji/e/1gqjxj8a6hhe.png'},
    {"category_id":3, "category_name":"ಮುನ್ನಚ್ಚರಿಕೆಗಳು", "category_url":'https://latestchika.com/wp-content/uploads/2020/03/handwash-1068x620.png'},
    {"category_id":4, "category_name":"ರೋಗಪರಿಹಾರ", "category_url" : 'https://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/pill.png'},
    {"category_id":5, "category_name":"ಕರೋನಾ ಬಗ್ಗೆ", "category_url": 'https://www.statnews.com/wp-content/uploads/2020/02/Coronavirus-CDC-768x432.jpg'}
],'ta': [
    {"category_id":1, "category_name":"அம்சங்கள்", "category_url": 'https://hotemoji.com/images/emoji/4/tgkksjy74i44.png'},
    {"category_id":2, "category_name":"நோய் பரவல் முறைகள்","category_url":'https://hotemoji.com/images/emoji/e/1gqjxj8a6hhe.png'},
    {"category_id":3, "category_name":"முன்னறிவிப்புகள்", "category_url":'https://latestchika.com/wp-content/uploads/2020/03/handwash-1068x620.png'},
    {"category_id":4, "category_name":"நோய் கண்டறிதல்", "category_url" : 'https://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/pill.png'},
    {"category_id":5, "category_name":"கொரோனா பற்றி", "category_url": 'https://www.statnews.com/wp-content/uploads/2020/02/Coronavirus-CDC-768x432.jpg'}
],'te': [
    {"category_id":1, "category_name":"లక్షణాలు", "category_url": 'https://hotemoji.com/images/emoji/4/tgkksjy74i44.png'},
    {"category_id":2, "category_name":"వ్యాధి వ్యాప్తి యొక్క రీతులు", "category_url":'https://hotemoji.com/images/emoji/e/1gqjxj8a6hhe.png'},
    {"category_id":3, "category_name":"భవిష్యత్", "category_url":'https://latestchika.com/wp-content/uploads/2020/03/handwash-1068x620.png'},
    {"category_id":4, "category_name":"వ్యాధి ఉపశమనం", "category_url" : 'https://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/pill.png'},
    {"category_id":5, "category_name":"కరోనా గురించి", "category_url": 'https://www.statnews.com/wp-content/uploads/2020/02/Coronavirus-CDC-768x432.jpg'}
],'ml': [
    {"category_id":1, "category_name":"സവിശേഷതകൾ", "category_url": 'https://hotemoji.com/images/emoji/4/tgkksjy74i44.png'},
    {"category_id":2, "category_name":"രോഗം പടരുന്ന രീതി", "category_url":'https://hotemoji.com/images/emoji/e/1gqjxj8a6hhe.png'},
    {"category_id":3, "category_name":"മുൻകരുതലുകൾ", "category_url":'https://latestchika.com/wp-content/uploads/2020/03/handwash-1068x620.png'},
    {"category_id":4, "category_name":"സുഖപ്പെടുത്തുന്നു", "category_url" : 'https://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/pill.png'},
    {"category_id":5, "category_name":"കൊറോണയെക്കുറിച്ച്", "category_url": 'https://www.statnews.com/wp-content/uploads/2020/02/Coronavirus-CDC-768x432.jpg'}
],'hi' : [
    {"category_id":1, "category_name":"विशेषताएं", "category_url": 'https://hotemoji.com/images/emoji/4/tgkksjy74i44.png'},
    {"category_id":2, "category_name":"रोग फैलने के तरीके", "category_url":'https://hotemoji.com/images/emoji/e/1gqjxj8a6hhe.png'},
    {"category_id":3, "category_name":"एहतियात", "category_url":'https://latestchika.com/wp-content/uploads/2020/03/handwash-1068x620.png'},
    {"category_id":4, "category_name":"इलाज", "category_url" : 'https://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/pill.png'},
    {"category_id":5, "category_name":"कोरोना के बारे में", "category_url": 'https://www.statnews.com/wp-content/uploads/2020/02/Coronavirus-CDC-768x432.jpg'}
]}
language = [
    {'lang_code': 'en', 'lang_name':'English', 'lang_url' : 'https://charbase.com/images/glyph/65'},
    {'lang_code': 'kn', 'lang_name':'ಕನ್ನಡ', 'lang_url' :'https://charbase.com/images/glyph/3221'},
    {'lang_code': 'te', 'lang_name':'తెలుగు', 'lang_url' :'https://charbase.com/images/glyph/3093'},
    {'lang_code': 'ta', 'lang_name':'தமிழ்', 'lang_url' :'https://charbase.com/images/glyph/2965'},
    {'lang_code': 'ml', 'lang_name':'മലയാളം', 'lang_url' :'https://charbase.com/images/glyph/3349'},
    {'lang_code': 'hi', 'lang_name':'हिन्दी', 'lang_url' : 'https://charbase.com/images/glyph/2325'}
]

def string_fixes(st, ch):
    st = st.lower()

    word_l = ['?', '.', '`', "'"]
    for i in word_l:
        st = st.replace(i ,"")    

    word_l = ["corona virus", "corona", 'coronavirus', 'coronavirus', 'covid-19', 'covid 19', 'covid', 'karuna', 'covid19', 'korona']
    for i in word_l:
        st = st.replace(i ,"virus")

    word_l = [' a ', ' an ', ' the ', ' am ', ' are ']
    for i in word_l:
        st = st.replace(i ," ")

    if ch is 1:
        word_l = ["cold", "common cold", "sneezing" ,"astama", "high fever", "mild fever", "fever", "headache", "respiratory problem", "respiratory problems", "respiratory"]
        for i in word_l:
            st = st.replace(i, "disorder")

    if ch is 3:
        word_l = ["delivery boy", "delivery guy", 'delivery person']
        for i in word_l:
            st = st.replace(i, "boy")
        word_l = ["newspapers", "money", "coins" ,"notes", "note", "coin", "vegetables vendors", "vegetables", "grocery vendors", "grocery things", "municipality workers", "fruits", "daily usage items", "daily items", "tissue paper", "newspaper", "news paper", "paper", "tissue"
        , "handkerchief", "clothes", "gas boy", "food boy", "pizza boy", "swiggy boy", "zomato boy", "drivers", "cab", "ola", "uber", "grocery"]
        for i in word_l:
            st = st.replace(i, "things_that_may_spread_virus")
        word_l = ["pregnant ladies", "pregnant", 'ladies', "aged people", "old people", "family members", "infant babies", "infants", "babies", "baby", "children"]
        for i in word_l:
            st = st.replace(i, "family_members")
        word_l = ["train ticket controller", "luggage", "baggage", 'tickets', 'ticket', 'bus', 'train', 'passport', 'boarding pass', 'grocery store vendor', 'vendor', 'shop keeper', 'shopkeeper', 'receptionist']
        for i in word_l:
            st = st.replace(i, "stuff")

    if ch is 4:
        word_l = ["turmeric", "alcohol", "booze", "wine", "any home remedies", "home remedies", "ayurvedic drug", "ayurvedic tablets", "ayurvedic syrup", "homeopathy drug", "homeopathy", "natural medicine"
        , "medicine", "indian traditional", "leaves", "twigs", "barks", "sacred tree", "tulsi", "home remedies"]
        for i in word_l:
            st = st.replace(i, "drug")

    return st


@app.route('/category', methods = ['GET'])
def category_list():
    try:
        lang = request.args.get('lang')
    except:
        reply = {"Error": "Missing Language Arguement"}
        return jsonify(reply), 400
    try:
        return jsonify({'category': category[lang]}), 200
    except:
        reply = {"Error": "Internal Server Error, Please contact devs"}
        return jsonify(reply), 500


@app.route('/language', methods = ['GET'])
def language_list():
    try:
        return jsonify({'language': language}), 200
    except:
        reply = {"Error": "Internal Server Error, Please contact devs"}
        return jsonify(reply), 500



@app.route('/<int:ch>', methods=['POST'])
def send_string(ch):
    try:
        some_json = request.get_json()

        st = some_json["ques"]
        lang = some_json['lang']

    except:
        reply = {"Error": "Json format error"}
        return jsonify(reply), 400 

    # try:
    if ch in list(range(1,6)):
        string = string_fixes(st, ch)
        chatbot = Chatbot(ch)
        reply = chatbot.prediction(string, lang)
        return jsonify(reply), 200

    else:
        reply = {"Error": "Invalid category"}
        return jsonify(reply), 501

    # except:
    #     reply = {"Error": "Internal Server Error, Please contact devs"}
    #     return jsonify(reply), 500
     

if __name__ == "__main__":
    app.run(debug=True)