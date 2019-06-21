
#include "ThingSpeak.h"
#include "secrets.h"
#include "ESP8266WiFi.h"

char ssid[] = SECRET_SSID;   
char pass[] = SECRET_PASS;            
WiFiClient  client;
unsigned long myChannelNumber = SECRET_CH_ID;
const char * myWriteAPIKey = SECRET_WRITE_APIKEY;
const int Relay1Pin = 4;  //D2 = GPIO4
const int Relay2Pin = 0; // D3 = GPIO0

int pasosUltimoEnvio = 0;
int pasos = 0;


void setup() {
  Serial.begin(115200);

  pinMode(Relay1Pin, OUTPUT);
  pinMode(Relay2Pin, OUTPUT);
  digitalWrite(Relay1Pin, LOW);         
  digitalWrite(Relay2Pin, LOW);         
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

  int relay1State = digitalRead(Relay1Pin); 
  if (relay1State == LOW)
  {
    Serial.println("Estado Relay 1: LOW");
  } else {
    Serial.println("Estado Relay 1: HIGH");
  }
  int relay2State = digitalRead(Relay2Pin); 
  if (relay2State == LOW)
  {
    Serial.println("Estado Relay 2: LOW");
  } else {
    Serial.println("Estado Relay 2: HIGH");
  }  


  
 
  int cambios = checkCola();
  if (cambios == 1){
      Serial.println("Cambios detectados. Esperando tiempo de envio...10x"+String(2-pasosUltimoEnvio));
      delay(10000*(2-pasosUltimoEnvio));
      relay1State = digitalRead(Relay1Pin); 
      relay2State = digitalRead(Relay2Pin); 
      ThingSpeak.setField(1, relay1State);
      ThingSpeak.setField(2, relay2State);
      ThingSpeak.writeFields(myChannelNumber, myWriteAPIKey);
      pasosUltimoEnvio = 0;
      pasos = 0;
      Serial.println("Datos enviados.");
  } 
  else {
    if (pasos > 5){
      relay1State = digitalRead(Relay1Pin); 
      relay2State = digitalRead(Relay2Pin); 
      ThingSpeak.setField(1, relay1State);
      ThingSpeak.setField(2, relay2State);
      ThingSpeak.writeFields(myChannelNumber, myWriteAPIKey);
      pasosUltimoEnvio = 0;
      pasos = 0;
      Serial.println("Datos enviados por timeout de 60 segundos");
    }
    else {
      if (pasosUltimoEnvio < 2){
        pasosUltimoEnvio = pasosUltimoEnvio+1;
      }
      pasos = pasos +1;
      Serial.println("Sin cambios");
    }
    Serial.println("Esperando 10 segundos..."+String(pasos));
     delay(10000);
  }
}


int checkCola(){  
  int cambios = 0;
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
      if (newCommand == "ILUMINACION1") {
         int relay1State = digitalRead(Relay1Pin); 
        cambios = 1;
         if (relay1State == LOW) {
           Serial.println("Conmutando Relay1 a estado: HIGH");
           digitalWrite(Relay1Pin, HIGH); 
          
          }
          else {  
           Serial.println("Conmutando Relay1 a estado: LOW");
           digitalWrite(Relay1Pin, LOW); 
            
          }
      }
      if (newCommand == "ILUMINACION2") {
         cambios = 1;
          int relay2State = digitalRead(Relay2Pin); 
         if (relay2State == LOW) {
          Serial.println("Conmutando Relay2 a estado: HIGH");
           digitalWrite(Relay2Pin, HIGH); 
          }
          else {  
           Serial.println("Conmutando Relay2 a estado: LOW");
           digitalWrite(Relay2Pin, LOW); 
            
          }
      }        
    }
    else {
      Serial.println("Nada Nuevo.");
    }

  }
  else {
    Serial.println("Problema checkeando cola. Codigo de error HTTP " + String(x));
  }
  return cambios;
  
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
