import 'dart:convert';

ReplyModel replyModelFromJson(String str) => ReplyModel.fromJson(json.decode(str));

String replyModelToJson(ReplyModel data) => json.encode(data.toJson());

class ReplyModel {
  String answer;
  String chain;
  String questionId;

  ReplyModel({
    this.answer,
    this.chain,
    this.questionId,
  });

  factory ReplyModel.fromJson(Map<String, dynamic> json) => ReplyModel(
    answer: json["answer"],
    chain: json["chain"],
    questionId: json["question_id"],
  );

  Map<String, dynamic> toJson() => {
    "answer": answer,
    "chain": chain,
    "question_id": questionId,
  };
}
