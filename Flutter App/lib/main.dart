import 'dart:convert';

import 'package:cached_network_image/cached_network_image.dart';
import 'package:sewaki/loading.dart';
import 'package:sewaki/pages/category_page.dart';
import 'package:http/http.dart' as http;
import 'package:flutter/material.dart';

void main() {
  runApp(MaterialApp(
    theme: ThemeData(accentColor: Color(0xff1fbfb8)),
    debugShowCheckedModeBanner: false,
    home: MyApp(),
  ));
}

String getId;
List data;
String langName;

class MyApp extends StatefulWidget {
  @override
  _MyAppState createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  String url = 'http://calm-crag-08514.herokuapp.com/language';
  bool isLoading = true;

  // ignore: missing_return
  Future<String> makeRequest() async {
    var response = await http
        .get(Uri.encodeFull(url), headers: {"Accept": "application/json"});

    setState(() {
      var extractData = json.decode(response.body);
      data = extractData['language'];
      isLoading = false;
    });
  }

  @override
  void initState() {
    super.initState();
    this.makeRequest();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[100],
      appBar: AppBar(
        backgroundColor: Color(0xff1fbfb8),
        title: Text(
          'ChatBot',
          style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
      ),
      body: isLoading ? Loading() : Container(
        child: ListView.builder(
          itemCount: data == null ? 0 : data.length,
          itemBuilder: (context, index) {
            return Column(
              children: <Widget>[
                (index == 0)
                    ? Column(
                        children: <Widget>[
                          SizedBox(
                            height: 10,
                          ),
                          CircleAvatar(
                            radius: 80,
                            backgroundColor: Colors.lightBlue,
                            backgroundImage: AssetImage("images/chatbot.png"),
                          ),
                          Container(
                              height: 50,
                              alignment: Alignment.center,
                              child: Text(
                                "Select a language",
                                style: TextStyle(fontSize: 25),
                              )),
                        ],
                      )
                    : Container(),
                Divider(
                  height: 0.0,
                ),
                ListTile(
                  trailing: Icon(Icons.navigate_next),
                  leading: CircleAvatar(
                    backgroundColor: Colors.white,
                    backgroundImage: CachedNetworkImageProvider(
                        '${data[index]['lang_url']}'),
                  ),
                  title: Text(data[index]['lang_name']),
                  onTap: () {
                    setState(() {
                      getId = data[index]['lang_code'];
                      langName = data[index]['lang_name'];
                    });
                    Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (context) => CategoryList()));
                  },
                ),
                Divider(
                  height: 0.0,
                ),
              ],
            );
          },
        ),
      ),
    );
  }
}
