/* ===============================================================
      Project: 4 Channel 5V Relay Module
       Author: Scott C
      Created: 7th Sept 2014
  Arduino IDE: 1.0.5
      Website: http://arduinobasics.blogspot.com.au
  Description: Explore the difference between NC and NO terminals.
================================================================== */

 /* 
  Connect 5V on Arduino to VCC on Relay Module
  Connect GND on Arduino to GND on Relay Module 
  Connect GND on Arduino to the Common Terminal (middle terminal) on Relay Module. */
 
 #define CH1 5  //5=(D1)   
 
 void setup(){
   //Setup all the Arduino Pins
   pinMode(CH1, OUTPUT);
   
   
   //Turn OFF any power to the Relay channels
   digitalWrite(CH1,LOW); //apagar 
   delay(1000); //Wait 2 seconds before starting sequence
 
 }
 
 void loop(){
   digitalWrite(CH1, HIGH);  //Green LED on, Yellow LED off
   delay(10000);
   digitalWrite(CH1, LOW);   //Yellow LED on, Green LED off
   delay(10000);
 }
    
