import 'package:sewaki/main.dart';
import 'package:sewaki/pages/category_page.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'model.dart';

class Screen extends StatefulWidget {
  @override
  _ScreenState createState() => _ScreenState();
}

String abc = "false";
String prev_qst = "-1";

String qst;

Future<ReplyModel> makeUser(String txt) async {
  final String url = 'http://calm-crag-08514.herokuapp.com/';

  final response = await http.post(url, body: {
    "language": getId,
    "category": catId,
    "question": txt,
    "chain": abc,
    "previous_question": prev_qst,
  });

  if (response.statusCode == 201 || response.statusCode == 200) {
    final String responseString = response.body;
    return replyModelFromJson(responseString);
  } else {
    return null;
  }
}

class _ScreenState extends State<Screen> {
  final List<ChatMessage> _messages = <ChatMessage>[];

  ReplyModel _reply;
  TextEditingController txtCtr = TextEditingController();

  Widget msg() {
    return Container(
      padding: EdgeInsets.all(1.0),
      child: Row(
        children: <Widget>[
          Flexible(
            child: Container(
              child: TextField(
                cursorColor: Colors.black,
                keyboardType: TextInputType.multiline,
                maxLines: null,
                style: TextStyle(color: Colors.black, fontSize: 15.0),
                controller: txtCtr,
                onSubmitted: _handleSubmitted,
                decoration: InputDecoration(
                    filled: true,
                    focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.all(Radius.circular(15.0))),
                    //fillColor:,
                    hintText: 'Type your message...',
                    hintStyle: TextStyle(color: Colors.black),
                    border: OutlineInputBorder(
                        borderRadius: BorderRadius.all(Radius.circular(15.0)),
                        borderSide:
                            BorderSide(color: Colors.black, width: 1.5)),
                    focusColor: Colors.black87,
                    suffixIcon: IconButton(
                      icon: Icon(
                        Icons.send,
                        color: Colors.black,
                      ),
                      onPressed: () {
                        if (txtCtr.text.isNotEmpty) {
                          setState(() {
                            qst = txtCtr.text;
                            _handleSubmitted(qst);
                          });
                        }
                      },
                    )),
              ),
            ),
          ),
        ],
      ),
    );
  }

  void Response(query) async {
    txtCtr.clear();
    ChatMessage message = new ChatMessage(
      text: _reply?.answer,
      name: "ChatBot",
      type: false,
    );
    setState(() {
      _messages.insert(0, message);
//      abc = _reply.chain;
      prev_qst = _reply.questionId.toString();
      abc = _reply.chain;
    });
  }

  void _handleSubmitted(String text) async {
    txtCtr.clear();
    ChatMessage message = ChatMessage(
      text: text,
      name: "Me",
      type: true,
    );

    setState(() {
      _messages.insert(0, message);
    });
    final ReplyModel reply = await makeUser(text);
    setState(() {
      _reply = reply;
    });
    Response(text);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[100],
      appBar: AppBar(
        leading: IconButton(
          icon: Icon(
            Icons.arrow_back_ios,
            color: Colors.black,
          ),
          onPressed: () => Navigator.pop(context),
        ),
        title: catName == null
            ? Text(
                'SeWaki',
                style:
                    TextStyle(color: Colors.black, fontWeight: FontWeight.bold),
              )
            : Text(
                catName,
                style:
                    TextStyle(color: Colors.black, fontWeight: FontWeight.bold),
              ),
        centerTitle: true,
        backgroundColor: Color(0xff1fbfb8),
      ),
      body: Column(children: <Widget>[
        Flexible(
            child: ListView.builder(
          padding: EdgeInsets.all(8.0),
          reverse: true,
          itemBuilder: (_, int index) {
            return _messages[index];
          },
          itemCount: _messages?.length,
        )),
        // Divider(height: 1.0),

        Container(
          color: Colors.transparent,
          child: Padding(
              padding: const EdgeInsets.all(8.0),
              child: (abc == "true")
                  ? Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: <Widget>[
                        RaisedButton(
                          child: Icon(Icons.check_circle),
                          onPressed: () {
                            setState(() {
                              abc = _reply.chain;
                              prev_qst = _reply.questionId;
                              print(prev_qst);
                              qst = "yes";
                            });
                            _handleSubmitted(qst);
                          },
                        ),
                        RaisedButton(
                          child: Icon(Icons.cancel),
                          onPressed: () {
                            setState(() {
                              abc = _reply.chain;
                              qst = "no";
                            });
                            _handleSubmitted(qst);
                          },
                        ),
                      ],
                    )
                  : msg()),
        ),
      ]),
    );
  }
}

class ChatMessage extends StatelessWidget {
  ChatMessage({this.text, this.name, this.type});

  final String text;
  final String name;
  final bool type;

  List<Widget> otherMessage(context) {
    return <Widget>[
      new Container(
        margin: EdgeInsets.only(right: 6.0),
        child: CircleAvatar(
            backgroundColor: Color(0xff1fbfb8),
            child: new Text(
              'S',
              style:
                  TextStyle(color: Colors.black, fontWeight: FontWeight.bold),
            )),
      ),
      Expanded(
        child: new Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Text(this.name, style: TextStyle(fontWeight: FontWeight.bold)),
            Container(
              margin: EdgeInsets.only(top: 5.0),
              padding: EdgeInsets.all(10),
              decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.all(Radius.circular(10)),
                  border: Border.all(color: Colors.black, width: 0.5)),
              child: Text(text),
            ),
          ],
        ),
      ),
    ];
  }

  List<Widget> myMessage(context) {
    return <Widget>[
      new Expanded(
        child: new Column(
          crossAxisAlignment: CrossAxisAlignment.end,
          children: <Widget>[
            //Text(this.name, style: Theme.of(context).textTheme.subhead),
            Container(
              decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.all(Radius.circular(10)),
                  border: Border.all(color: Colors.black, width: 0.5)),
              margin: EdgeInsets.only(top: 5.0),
              padding: EdgeInsets.all(10),
              child: Text(text),
            ),
          ],
        ),
      ),
      Container(
        margin: EdgeInsets.only(left: 6.0),
        child: CircleAvatar(
            backgroundColor: Colors.blueGrey,
            child: Text(
              this.name[0],
              style:
                  TextStyle(fontWeight: FontWeight.bold, color: Colors.black),
            )),
      ),
    ];
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.symmetric(vertical: 10.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: this.type ? myMessage(context) : otherMessage(context),
      ),
    );
  }
}
