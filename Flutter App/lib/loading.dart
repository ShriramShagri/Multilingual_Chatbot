import 'package:flutter/material.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart' show SpinKitPouringHourglass, SpinKitWave;


class Loading extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.white,
      child: Center(
        child: SpinKitWave(
          color: Color(0xff1fbfb8),
          size: 50.0,
        ),
      ),
    );
  }
}
