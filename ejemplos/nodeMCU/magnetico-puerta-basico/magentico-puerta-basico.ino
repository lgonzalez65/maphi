bool prevValue = true;
 
void setup() {
  Serial.begin(9600);
  
  pinMode(13, INPUT_PULLUP);
  
  pinMode(12, OUTPUT);
  digitalWrite(12, LOW);
}
 
void loop() {
  if (prevValue != digitalRead(13)) {
    if (prevValue == true)
      Serial.println("Close");
    else
      Serial.println("Open");
    
    prevValue = digitalRead(13);
    delay(150);
  }
}
