
#include "ThingSpeak.h"
#include "secrets.h"
#include "ESP8266WiFi.h"

char ssid[] = SECRET_SSID;   
char pass[] = SECRET_PASS;            
WiFiClient  client;
unsigned long myChannelNumber = SECRET_CH_ID;
const char * myWriteAPIKey = SECRET_WRITE_APIKEY;


int analogChannel_000 = 0; //Canal 0; unico canal A/D.
int sensorReading = 0;     //Lectura del sensor [0-1023].
float I1rms = 0;         //Valor calculado.
//Valor de calibracion obtenido para
//con R1+R2=R=657.2 ohms)
float Ki = 0.021786191;

void setup() {
  Serial.begin(115200);     
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

 // A/D y calcular la corriente
    sensorReading = analogRead(analogChannel_000);
    I1rms = float (sensorReading)*Ki;

  Serial.println("Lectura Analogica: " + String(sensorReading));
  Serial.println("Consumo (A): " + String(I1rms));

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

  ThingSpeak.setField(1, I1rms);
  ThingSpeak.writeFields(myChannelNumber, myWriteAPIKey);
  
   delay(30000);

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
