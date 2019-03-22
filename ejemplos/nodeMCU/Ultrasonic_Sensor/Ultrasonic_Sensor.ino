#define TRIG_PIN 2 //D4
#define ECHO_PIN 0 //D3

void setup()
{
Serial.begin(9600);
pinMode(TRIG_PIN, OUTPUT);
pinMode(ECHO_PIN, INPUT);
}

void loop()
{ 
// Clears the trigPin for 2 microseconds
digitalWrite(TRIG_PIN, LOW);
delayMicroseconds(2);

// Sets the trigPin on HIGH state for 10 microseconds
digitalWrite(TRIG_PIN, HIGH);
delayMicroseconds(10);
digitalWrite(TRIG_PIN, LOW);

// Reads the echoPin, returns the sound wave travel time in microseconds
long duration = pulseIn(ECHO_PIN, HIGH);

// Prints the duration on the Serial Monitor
Serial.print("Duration (us): ");
Serial.println(duration);

// Calculating the distance ( distance = (duration/1.000.000)*(1/2) x (0.034 x 1000.000 cm/s) )
float distance = duration*0.017;

// Prints the distance on the Serial Monitor
Serial.print("Distance (cm): ");
Serial.println(distance,3);

Serial.println();

delay(1000);
}
