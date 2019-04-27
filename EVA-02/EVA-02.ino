
#include "ThingSpeak.h"
#include "secrets.h"
#include "ESP8266WiFi.h"
#include "DHT.h"

#define DHTTYPE DHT22

char ssid[] = SECRET_SSID;   
char pass[] = SECRET_PASS;   
int keyIndex = 0;            
WiFiClient  client;
unsigned long myChannelNumber = SECRET_CH_ID;
const char * myWriteAPIKey = SECRET_WRITE_APIKEY;
float t=0;
float h=0; 
const int DHTPin = 12; // DHT Sensor 12 = (D6)
const int MagOutPin = 13;
const int MagInPin = 15;
int LDR = 0;
int puerta;

DHT dht(DHTPin, DHTTYPE); /////

void setup() {
  Serial.begin(115200);
  dht.begin(); 
  pinMode(MagOutPin, OUTPUT);
  pinMode(MagInPin, INPUT_PULLUP);
  digitalWrite(MagOutPin, LOW);         
  WiFi.mode(WIFI_STA); 
  ThingSpeak.begin(client);  // Initialize ThingSpeak
  
}

void loop() {

  // Connect or reconnect to WiFi
  if(WiFi.status() != WL_CONNECTED){
    Serial.println("\nMAC Address: "+ WiFi.macAddress());
    Serial.print("Intentando conectar al SSID: ");
    Serial.println(SECRET_SSID);
    while(WiFi.status() != WL_CONNECTED){
      WiFi.begin(ssid, pass);  // Connect to WPA/WPA2 network. Change this line if using open or WEP network
      Serial.print(".");
      delay(5000);     
    } 
    Serial.println("");
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());
  }

  float t = dht.readTemperature();
  // Hacemos pausa de tres segundos antes de cada nueva medición
  //al sensor le cuesta 250ms leer estos datos
  delay(3000);
  float h = dht.readHumidity();

  if (isnan(h) || isnan(t)) {
    Serial.println("Fallo en la lectura del sensor DHT!");
    return;
  }
  Serial.println("Temperatura: " + String(t));
  Serial.println("Humedad: " + String(h));

  puerta = digitalRead(MagInPin);

     Serial.println("Estado Puerta: " + String(puerta));


  LDR = analogRead(A0);
  float voltajeLDR = LDR * (3.3 / 1024.0);
  float porcentajeLDR = voltajeLDR * 100 / 3.3;

  Serial.println("Resistencia LDR: " + String(LDR));
  Serial.println("Voltaje LDR: " + String(voltajeLDR));
  Serial.println("% Iluminacion Ambiente: " + String(porcentajeLDR));
  
  ThingSpeak.setField(1, t);
  ThingSpeak.setField(2, h);
  ThingSpeak.setField(3, puerta);
  ThingSpeak.setField(4, porcentajeLDR);
  ThingSpeak.setField(5, voltajeLDR);
  ThingSpeak.setField(6, LDR);
  ThingSpeak.writeFields(myChannelNumber, myWriteAPIKey);

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
    Serial.println("Checkeando cola...");
    // Check for a command returned from TalkBack
    if (newCommand.length() != 0) {
      Serial.print("  Ultimo comando de la cola: ");
      Serial.println(newCommand);
      if (newCommand == "RESTART") {
         Serial.println("Reiniciando...");
         ESP.restart();
      }
    }
    else {
      Serial.println("Nada Nuevo.");
    }

  }
  else {
    Serial.println("Problema checkeando cola. Codigo de error HTTP " + String(x));
  }
  

  delay(27000); // Wait 30 seconds to update the channel again  
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
