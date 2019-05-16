# Bluetooth SPP terminal app for ChromeOS

## Introduction

I wanted a simple Bluetooth SPP terminal app for my Chromebook but the Chrome web-store didn't have much to offer that suited my needs. So I decided to write this app to let me connect to my SPP (serial port profile) Bluetooth devices, such as Arduino circuits and even my desktop CNC router and LASER cutter, and save data from them. As it might be useful for others writing Bluetooth apps for ChromeOS I decided to publish it here as open-source code. It works in clamshell and tablet mode and you can see what it looks like in the images folder and the picture below.

![Screenshot](https://github.com/drandrewthomas/ChromeOS_Bluetooth_SPP_terminal/blob/master/images/screenshot.png)

## Using the app

The easiest way to install the app (apart from expert users sideloading thecode) is from the Chrome web store:

***LINKSOON***

Then just run it like any other Chrome app. To connect to SPP devices you obviously need to turn on Bluetooth on your Chromebook. Then the app will show a dropdown list of all SPP devices that the Bluetooth adaptor knows about. That's very important: basically if you don't see your device listed (or any device even) it means you need to pair the SPP device with your Chromebook **before** opening the app. Then, when you open the app you should find your device in the dropdown.

Once you connect to your SPP device the app works much like the serial monitor in the Arduino IDE. Text to send needs to be typed into the box at the top, and sent using the send button. Again like the Arduino serial monitor, you can choose the type of line ending you want from the dropdown by the text box.

At the bottom of the app you'll also find two buttons: one to clear the text and one to save it. Clicking the save button causes download of the whole of the text received from the SPP device since it was last cleared. You can scroll back through the text too, although preferably not while the SPP device is sending text as the last received text is always scrolled to when it arrives.

Also, the text is retained when you disconnect and reconnect, so that you can collect and save data from multiple devices. And, apart from the above, hopefully use of the rest of the app interface will be quite obvious. However, if you have any issues, or find any bugs, please report them here on Github.

## Privacy

This project works entirely as a web-app on your Chromebook. None of your files are uploaded to a server while you use this software. Also, no private data about you or your files is collected or transmitted by this software and no cookies are used. However, please note that, as described in the license file, you use this software at your own risk.

## Credits and sources

The following projects are used in this app, for which I'm very grateful :-)

JQuery: [https://jquery.com](https://jquery.com) does lots of things to make coding easier!

FileSaver: [https://github.com/eligrey/FileSaver.js](https://github.com/eligrey/FileSaver.js) allows larger file downloads consistently over a range of browsers.

Sample BT Connect app: [https://github.com/mimetics/Chrome-BTconnect-App](https://github.com/mimetics/Chrome-BTconnect-App) helped me get started with ChromeOS Bluetooth coding.
