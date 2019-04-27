/*
  WriteSingleField
  
  Description: Writes a value to a channel on ThingSpeak every 20 seconds.
  
  Hardware: ESP8266 based boards
  
  !!! IMPORTANT - Modify the secrets.h file for this project with your network connection and ThingSpeak channel details. !!!
  
  Note:
  - Requires ESP8266WiFi library and ESP8622 board add-on. See https://github.com/esp8266/Arduino for details.
  - Select the target hardware from the Tools->Board menu
  - This example is written for a network using WPA encryption. For WEP or WPA, change the WiFi.begin() call accordingly.
  
  ThingSpeak ( https://www.thingspeak.com ) is an analytic IoT platform service that allows you to aggregate, visualize, and 
  analyze live data streams in the cloud. Visit https://www.thingspeak.com to sign up for a free account and create a channel.  
  
  Documentation for the ThingSpeak Communication Library for Arduino is in the README.md folder where the library was installed.
  See https://www.mathworks.com/help/thingspeak/index.html for the full ThingSpeak documentation.
  
  For licensing information, see the accompanying license file.
  
  Copyright 2018, The MathWorks, Inc.
*/

#include "ThingSpeak.h"
#include "secrets.h"
#include "ESP8266WiFi.h"
#include "DHT.h"

//#define DHTTYPE DHT11   // DHT 11
#define DHTTYPE DHT22   // DHT 22

char ssid[] = SECRET_SSID;   // your network SSID (name) 
char pass[] = SECRET_PASS;   // your network password
int keyIndex = 0;            // your network key Index number (needed only for WEP)
WiFiClient  client;

unsigned long myChannelNumber = SECRET_CH_ID;
const char * myWriteAPIKey = SECRET_WRITE_APIKEY;

int number = 0;
int sensorReading = 0; ////
float tension = 0; ////
int analogChannel_000 = 0; ////
float t=0; /////
float h=0; /////
const int DHTPin = 5; ///// DHT Sensor
static char temperatureTemp[7]; ///// DHT Sensor
static char humidityTemp[7]; ///// DHT Sensor
// Initialize DHT sensor.
DHT dht(DHTPin, DHTTYPE); /////


void setup() {
  dht.begin();           /////
  Serial.begin(115200);  // Initialize serial
  WiFi.mode(WIFI_STA); 
  ThingSpeak.begin(client);  // Initialize ThingSpeak
}

void loop() {

  // Connect or reconnect to WiFi
  if(WiFi.status() != WL_CONNECTED){
    Serial.print("Attempting to connect to SSID: ");
    Serial.println(SECRET_SSID);
    while(WiFi.status() != WL_CONNECTED){
      WiFi.begin(ssid, pass);  // Connect to WPA/WPA2 network. Change this line if using open or WEP network
      Serial.print(".");
      delay(5000);     
    } 
    Serial.println("\nConnected.");
  }
  //---TENSION (Ch1)
  // Write to ThingSpeak. There are up to 8 fields in a channel, allowing you to store up to 8 different
  // pieces of information in a channel.  Here, we write to field 1.
  int x1 = ThingSpeak.writeField(myChannelNumber, 1, tension, myWriteAPIKey);
  if(x1 == 200){
    Serial.println("Channel update successful.");
  }
  else{
    Serial.println("Problem updating channel. HTTP error code " + String(x1));
  }
  sensorReading = analogRead(analogChannel_000);
  tension = float (sensorReading) / 1024 * 5/4.5 * 220;
  
  //---TEMPERATURA (Ch3) /////
  
  int x3 = ThingSpeak.writeField(myChannelNumber, 3, t, myWriteAPIKey); 
  if(x3 == 200){
    Serial.println("Channel update successful."); 
  }
  else{
    Serial.println("Problem updating channel. HTTP error code " + String(x3));
  }
  // Read temperature as Celsius (the default)
  float t = dht.readTemperature();

  //---HUMEDAD (Ch4) /////
  
  int x4 = ThingSpeak.writeField(myChannelNumber, 4, h, myWriteAPIKey);
  if(x4 == 200){
    Serial.println("Channel update successful.");
  }
  else{
    Serial.println("Problem updating channel. HTTP error code " + String(x4));
  }
  float h = dht.readHumidity();

 //---
  Serial.println("Tension : "+String(tension));
  
  delay(20000); // Wait 20 seconds to update the channel again
}
