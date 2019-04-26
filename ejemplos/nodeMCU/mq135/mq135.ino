#define ANALOGPIN A0
#define DIGITALPIN D1 
#include "ThingSpeak.h"
#include "secrets.h"
#include "ESP8266WiFi.h"

char ssid[] = SECRET_SSID;   // your network SSID (name) 
char pass[] = SECRET_PASS;   // your network password
WiFiClient  client;
unsigned long myChannelNumber = SECRET_CH_ID;
const char * myWriteAPIKey = SECRET_WRITE_APIKEY;


void setup() {
  Serial.begin(9600);
  WiFi.mode(WIFI_STA); 
  ThingSpeak.begin(client);  // Initialize ThingSpeak
  pinMode(DIGITALPIN, INPUT);
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
  int adc_MQ = analogRead(A0); //Lemos la salida analógica del MQ
  float voltaje = adc_MQ * (5.0 / 1023.0); //Convertimos la lectura en un valor de voltaje
  boolean mq_estado = digitalRead(DIGITALPIN);//Leemos el sensor
  if(mq_estado) //si la salida del sensor es 1
  {
    Serial.println("Sin presencia");
  }
  else //si la salida del sensor es 0
  {
    Serial.println("Algo detectado");
  }
  Serial.print("adc:");
  Serial.print(adc_MQ);
  Serial.print("    voltaje:");
  Serial.println(voltaje);

  ThingSpeak.setField(1, adc_MQ);
  ThingSpeak.setField(2, voltaje);
  ThingSpeak.writeFields(myChannelNumber, myWriteAPIKey);
  delay(10000);
}
