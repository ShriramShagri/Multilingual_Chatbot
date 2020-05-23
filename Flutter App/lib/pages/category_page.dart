import 'dart:convert';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:sewaki/loading.dart';
import 'package:sewaki/pages/screen.dart';
import 'package:http/http.dart' as http;
import 'package:flutter/material.dart';

import '../main.dart';

class CategoryList extends StatefulWidget {
  @override
  _CategoryListState createState() => _CategoryListState();
}

List catData;
String catName;
String catId;

class _CategoryListState extends State<CategoryList> {
  String url = 'http://calm-crag-08514.herokuapp.com/category?lang=$getId';
  bool isLoading = true;

  // ignore: missing_return
  Future<String> makeRequest() async {
    var response = await http
        .get(Uri.encodeFull(url), headers: {"Accept": "application/json"});

    setState(() {
      var extractData = json.decode(response.body);
      catData = extractData['category'];
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
        leading: IconButton(
          icon: Icon(
            Icons.arrow_back_ios,
            color: Colors.black,
          ),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          'Category List',
          style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
        backgroundColor: Color(0xff1fbfb8),
      ),
      body: isLoading
          ? Loading()
          : Container(
              child: ListView.builder(
                itemCount: catData == null ? 0 : catData.length,
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
                                  backgroundImage:
                                      AssetImage("images/chatbot.png"),
                                ),
                                SizedBox(
                                  height: 10,
                                )
                              ],
                            )
                          : Container(),
                      Divider(
                        height: 0.0,
                      ),
                      ListTile(
                        title: Text(catData[index]['category_name']),
                        leading: CircleAvatar(
                          backgroundColor: Colors.white,
                          backgroundImage: CachedNetworkImageProvider(
                              catData[index]['category_url']),
                        ),
                        trailing: Icon(Icons.navigate_next),
                        onTap: () {
                          setState(() {
                            catId = catData[index]['category_id'].toString();
                            catName = catData[index]['category_name'];
                          });
                          Navigator.push(
                              context,
                              MaterialPageRoute(
                                  builder: (context) => Screen()));
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
