
void setup()
{
  Serial.begin(9600);
  // Pin D1 del NodeMCU conectado al pin D0 del sensor de lluvia 
  pinMode(  5, INPUT);
  
}

void loop()
{
 Serial.println(digitalRead(5));
 delay(1000);
}
