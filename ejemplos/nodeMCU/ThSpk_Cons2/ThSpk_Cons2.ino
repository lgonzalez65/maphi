
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
  
  // Escribir en ThingSpeak
  ThingSpeak.setField(CAMPO_CONSUMO, I1rms);
  ThingSpeak.writeFields(myChannelNumber, myWriteAPIKey);
  
  delay(15000*NUM_SENSORES); // Esperar 15*N segundos para reescribir en el canal  
}
