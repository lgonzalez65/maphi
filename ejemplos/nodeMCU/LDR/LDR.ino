/*
 * Interface LDR with NodeMCU
 * By TheCircuit
 */
void setup() {
  // initialize serial communication at 9600 bits per second:
  Serial.begin(115200);
}

void loop() {
  // read the input on analog pin 0:
  int sensorValue = analogRead(A0);
  
  // Convert the analog reading (which goes from 0 - 1023) to a voltage (0 - 5V):
  float voltage = sensorValue * (3.3 / 1024.0);
  
  // print out the value you read:
  Serial.print(sensorValue);
  Serial.print(" - ");
  Serial.println(voltage);
  

  delay(1000);
  
}
