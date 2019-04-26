
#include "ThingSpeak.h"
#include "secrets.h"
#include "ESP8266WiFi.h"

char ssid[] = SECRET_SSID;   // your network SSID (name) 
char pass[] = SECRET_PASS;   // your network password
int keyIndex = 0;            // your network key Index number (needed only for WEP)
WiFiClient  client;
unsigned long myChannelNumber = SECRET_CH_ID;
const char * myWriteAPIKey = SECRET_WRITE_APIKEY;
bool p;

void cambioDeEstadoPuerta(){
  noInterrupts();
  p = digitalRead(13); //D7
   if (p){
       Serial.println("Abierto");
   }
   else {
       Serial.println("Cerrado");
      
     }
  ThingSpeak.setField(5, float(p));   
  ThingSpeak.writeFields(myChannelNumber, myWriteAPIKey);
  interrupts();
}

void setup() {
  Serial.begin(115200);
  WiFi.mode(WIFI_STA); 
  ThingSpeak.begin(client);  // Initialize ThingSpeak
  pinMode(13, INPUT_PULLUP); //D7
  pinMode(12, OUTPUT); //D6
  digitalWrite(12, LOW);
  cambioDeEstadoPuerta();
  attachInterrupt(13,cambioDeEstadoPuerta,CHANGE);

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
  
 // delay(20000); // Wait 20 seconds to update the channel again  
}
