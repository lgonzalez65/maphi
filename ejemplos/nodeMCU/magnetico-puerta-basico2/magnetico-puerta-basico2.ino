bool m = true;
 
void setup() {
  Serial.begin(115200);
  
  pinMode(15, INPUT);
  
  pinMode(13, OUTPUT);
  digitalWrite(13, HIGH);
}
 
void loop() {
  
    m = digitalRead(15);
    Serial.println( String(m));
  delay(150);
}
