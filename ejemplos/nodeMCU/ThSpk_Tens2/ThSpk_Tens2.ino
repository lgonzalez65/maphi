
#include "ThingSpeak.h"
#include "secrets.h"
#include "ESP8266WiFi.h"

char ssid[] = SECRET_SSID;   // your network SSID (name) 
char pass[] = SECRET_PASS;   // your network password
int keyIndex = 0;            // your network key Index number (needed only for WEP)
WiFiClient  client;

unsigned long myChannelNumber = SECRET_CH_ID;
const char * myWriteAPIKey = SECRET_WRITE_APIKEY;

int analogChannel_000 = 0; //Canal 0; unico canal A/D.
int sensorReading = 0;     //Lectura del sensor [0-1023].
float tension = 0;         //Valor calculado.
// Valores de calibracion obtenidos para
// VdiodoProm=0.4915, R2=10.260, R1=21810, kpot=0.533
float a = 0.245367927042692; 
float b = 12.7432427082836;

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
  // A/D y calcular la tension
    sensorReading = analogRead(analogChannel_000);
    tension = float (sensorReading) * a + b;
    if (tension < 15.0) { //El adc no puede medir tensiones inferiores a la constante b
        tension = 0;
    }
  
  // Escribir en ThingSpeak
  ThingSpeak.setField(CAMPO_TENSION, tension);
  ThingSpeak.writeFields(myChannelNumber, myWriteAPIKey);
  
  delay(15000*NUM_SENSORES); // Esperar 15*N segundos para reescribir en el canal  
}
