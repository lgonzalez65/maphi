
#include "ThingSpeak.h"
#include "secrets.h"
#include "ESP8266WiFi.h"
#include "DHT.h"

#define DHTTYPE DHT22

char ssid[] = SECRET_SSID;   // your network SSID (name) 
char pass[] = SECRET_PASS;   // your network password
int keyIndex = 0;            // your network key Index number (needed only for WEP)
WiFiClient  client;
unsigned long myChannelNumber = SECRET_CH_ID;
const char * myWriteAPIKey = SECRET_WRITE_APIKEY;
float t=0; /////
float h=0; /////
// Initialize DHT sensor.
const int DHTPin = 5; ///// DHT Sensor 5=(D1) 

DHT dht(DHTPin, DHTTYPE); /////

void setup() {
  Serial.begin(115200);
  dht.begin();          
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

  ThingSpeak.setField(2, t);
  ThingSpeak.setField(1, h);
  
  ThingSpeak.writeFields(myChannelNumber, myWriteAPIKey);


  delay(20000); // Wait 20 seconds to update the channel again  
}
