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
 
 #define CH1 8   // Connect Digital Pin 8 on Arduino to CH1 on Relay Module
 
 void setup(){
   //Setup all the Arduino Pins
   pinMode(CH1, OUTPUT);
   
   
   //Turn OFF any power to the Relay channels
   digitalWrite(CH1,LOW);
   delay(2000); //Wait 2 seconds before starting sequence
 
 }
 
 void loop(){
   digitalWrite(CH1, HIGH);  //Green LED on, Yellow LED off
   delay(3000);
   digitalWrite(CH1, LOW);   //Yellow LED on, Green LED off
   delay(3000);
 }
    
