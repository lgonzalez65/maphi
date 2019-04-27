// Load Wi-Fi library
#include <ESP8266WiFi.h>

#define TRIG_PIN 2 //D4
#define ECHO_PIN 0 //D3

const char* ssid     = "TATOOINE-MKT";
const char* password = "Luna2312";
//const char* ssid     = "CAMPUS";
//const char* password = "CAMPUSUARG";


long duration;
float distance;

// Set web server port number to 80
WiFiServer server(80);
// Variable to store the HTTP request
String header;

void setup()
{
  Serial.begin(9600);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);

  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  // Print local IP address and start web server
  Serial.println("");
  Serial.println("WiFi connected.");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  server.begin();
}

void loop()
{
  WiFiClient client = server.available();   // Listen for incoming clients

  if (client) {                             // If a new client connects,
    Serial.println("New Client.");          // print a message out in the serial port
    String currentLine = "";                // make a String to hold incoming data from the client
    while (client.connected()) {            // loop while the client's connected
      if (client.available()) {             // if there's bytes to read from the client,
        char c = client.read();             // read a byte, then
        Serial.write(c);                    // print it out the serial monitor
        header += c;
        if (c == '\n') {                    // if the byte is a newline character
          // if the current line is blank, you got two newline characters in a row.
          // that's the end of the client HTTP request, so send a response:
          if (currentLine.length() == 0) {
            // HTTP headers always start with a response code (e.g. HTTP/1.1 200 OK)
            // and a content-type so the client knows what's coming, then a blank line:
            client.println("HTTP/1.1 200 OK");
            client.println("Content-type:text/html");
            client.println("Connection: close");
            client.println();

            // turns the GPIOs on and off
            if (header.indexOf("GET /DISTANCIA") >= 0) {

              // Clears the trigPin for 2 microseconds
              digitalWrite(TRIG_PIN, LOW);
              delayMicroseconds(5);

              // Sets the trigPin on HIGH state for 10 microseconds
              digitalWrite(TRIG_PIN, HIGH);
              delayMicroseconds(10);
              digitalWrite(TRIG_PIN, LOW);

              // Reads the echoPin, returns the sound wave travel time in microseconds
              duration = pulseIn(ECHO_PIN, HIGH);
              // Calculating the distance ( distance = (duration/1.000.000)*(1/2) x (0.034 x 1000.000 cm/s) )
              distance = duration * 0.017;

              Serial.println(duration);
              Serial.println(distance, 3);


            }

            // Display the HTML web page
            client.println("<!DOCTYPE html><html>");
            client.println("<head><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">");
            client.println("<link rel=\"icon\" href=\"data:,\">");
            // CSS to style the on/off buttons
            // Feel free to change the background-color and font-size attributes to fit your preferences
            client.println("<style>html { font-family: Helvetica; display: inline-block; margin: 0px auto; text-align: center;}");
            client.println(".button { background-color: #195B6A; border: none; color: white; padding: 16px 40px;");
            client.println("text-decoration: none; font-size: 30px; margin: 2px; cursor: pointer;}");
            client.println(".button2 {background-color: #77878A;}</style></head>");

            // Web Page Heading
            client.println("<body><h1>ESP8266 Web Server</h1>");

            client.print("Duration (us): ");
            client.println(duration);
            client.print("Distance (cm): ");
            client.println(distance, 3);
            client.println();
            client.println("<p><a href=\"/DISTANCIA\"><button class=\"button\">MEDIR</button></a></p>");
            client.println("</body></html>");

            // The HTTP response ends with another blank line
            client.println();
            // Break out of the while loop
            break;
          } else { // if you got a newline, then clear currentLine
            currentLine = "";
          }
        } else if (c != '\r') {  // if you got anything else but a carriage return character,
          currentLine += c;      // add it to the end of the currentLine
        }
      }
    }
    // Clear the header variable
    header = "";
    // Close the connection
    client.stop();
    Serial.println("Client disconnected.");
    Serial.println("");
  }
}
