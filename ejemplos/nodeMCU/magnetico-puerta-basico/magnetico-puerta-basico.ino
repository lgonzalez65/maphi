bool prevValue = true;
 
void setup() {
  Serial.begin(115200);
  
  pinMode(15, INPUT_PULLUP);
  
  pinMode(13, OUTPUT);
  digitalWrite(13, LOW);
}
 
void loop() {
  if (prevValue != digitalRead(15)) {
    if (prevValue == true)
      Serial.println("Close");
    else
      Serial.println("Open");
    
    prevValue = digitalRead(15);
    
  }
  delay(150);
}
