/*

  FetchCommandFromTalkBack

  Description: Checks a TalkBack queue every 10 seconds and set the state of the build in LED according
             to the latest command fetched. Turn the LED on and off by using the commands TURN_ON and TURN_OFF.
             The TalkBack documentation can be found at https://www.mathworks.com/help/thingspeak/talkback-app.html

  Hardware: ESP8266-based boards

  Copyright 2018, The MathWorks, Inc
*/

#include "secrets.h"
#include <ESP8266WiFi.h>

#define LED_BUILTIN 2
#define CH1 5  //5=(D1)  CONEXIONADO RELAY #1


//unsigned long myTalkBackID = 32240;
//const char * myTalkbackKey = "KG7WJIDG4IW5KPOF";
WiFiClient  client;


void setup() {
  pinMode(LED_BUILTIN, OUTPUT);  // Set up LED
  pinMode(CH1, OUTPUT); // Set up Relay
  digitalWrite(CH1,LOW); //Turn off 
  Serial.begin(115200);          // Initialize serial
  
}

void loop() {

  // Connect or reconnect to WiFi
  if (WiFi.status() != WL_CONNECTED) {
    Serial.print("Attempting to connect to SSID: ");
    Serial.println(String(SECRET_SSID));
    while (WiFi.status() != WL_CONNECTED) {
      WiFi.begin(SECRET_SSID, SECRET_PASS);
      Serial.print(".");
      delay(5000);
    }
    Serial.println("\nConnected.");
    Serial.print("\nIP address: ");
    Serial.println(WiFi.localIP());
  }

  // Create the TalkBack URI
  String tbURI = String("/talkbacks/") + String(myTalkBackID) + String("/commands/execute");

  // Create the message body for the POST out of the values
  String postMessage =  String("api_key=") + String(myTalkbackKey);

  // Make a string for any commands that might be in the queue
  String newCommand = String();

  // Make the POST to ThingSpeak
  int x = httpPOST(tbURI, postMessage, newCommand);
  client.stop();

  // Check the result
  if (x == 200) {
    Serial.println("checking queue...");
    // Check for a command returned from TalkBack
    if (newCommand.length() != 0) {

      Serial.print("  Latest command from queue: ");
      Serial.println(newCommand);

      if (newCommand == "LED_ON") {
        digitalWrite(LED_BUILTIN, LOW);
        digitalWrite(CH1, LOW);  //Green LED on, 
      }

      if (newCommand == "LED_OFF") {
        digitalWrite(LED_BUILTIN, HIGH);
        digitalWrite(CH1, HIGH);  //Green LED on, 
      }
    }
    else {
      Serial.println("  Nothing new.");
    }

  }
  else {
    Serial.println("Problem checking queue. HTTP error code " + String(x));
  }


  delay(5000); // Wait 5 seconds to check queue again
}

// General function to POST to ThingSpeak
int httpPOST(String uri, String postMessage, String &response) {

  bool connectSuccess = false;
  connectSuccess = client.connect("api.thingspeak.com", 80);

  if (!connectSuccess) {
    return -301;
  }

  postMessage += "&headers=false";

  String Headers =  String("POST ") + uri + String(" HTTP/1.1\r\n") +
                    String("Host: api.thingspeak.com\r\n") +
                    String("Content-Type: application/x-www-form-urlencoded\r\n") +
                    String("Connection: close\r\n") +
                    String("Content-Length: ") + String(postMessage.length()) +
                    String("\r\n\r\n");

  client.print(Headers);
  client.print(postMessage);

  long startWaitForResponseAt = millis();
  while (client.available() == 0 && millis() - startWaitForResponseAt < 5000) {
    delay(100);
  }

  if (client.available() == 0) {
    return -304; // Didn't get server response in time
  }

  if (!client.find(const_cast<char *>("HTTP/1.1"))) {
    return -303; // Couldn't parse response (didn't find HTTP/1.1)
  }

  int status = client.parseInt();
  if (status != 200) {
    return status;
  }

  if (!client.find(const_cast<char *>("\n\r\n"))) {
    return -303;
  }

  String tempString = String(client.readString());
  response = tempString;

  return status;

}
