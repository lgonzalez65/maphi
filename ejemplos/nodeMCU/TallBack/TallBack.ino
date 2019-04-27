/*****************************************************************
 * Board: NodeMCU 1.0 ESP8266 (ESP-12E Module)
 * Developed by: Akshay P Daga       Email: apdaga@gmail.com
 * 
 * Description:
 * In this program, 
 * BUILT-IN LED on NodeMCU Board is controlled using TalkBack Application 
 * from https://thinkspeak.com server.
 * 
 * Output is shown using LED & Serial Monitor on PC.
 * 
********************************************************************/
/****************************************************************** 
 * PHYSICAL CONNECTIONS:
 * Just Connect NodeMCU Board with PC using Micro USB cable.
 * Nothing else......
 * 
 * Serial Communication with PC through USB cable (Tx0 and Rx0)
 *****************************************************************/

 /****************************************************************
 * STEPS:
 * 1. Sign up at https://thingspeak.com
 * 2. Apps > TalkBalk > New TalkBack > Update "Name" > Click on "Add a new Command"
 *    update position=1, command string=LED_ON > Click on "Add a new Command"
 *    update position=2, command string=LED_OFF" > Save TalkBalk
 * 3. Copy following things and replace those in the below program:
 *    a. API_Key
 *    b. TalkBack_ID
 *    c. Command_ID (For LED_ON)
 *    d. Command_ID (For LED_OFF)
 * 4. Make all the Connections to Arduino Mega board mentioned Above.   
 * 5. Change Following 6 fields in below written program.
 *    a. ssid_name (Name of you WiFi)
 *    b. password (Passord of your WiFi)
 *    c. API_Key
 *    d. TalkBack_ID
 *    e. Command_ID
 *    
 *    FORMAT:
 *    https://api.thingspeak.com/talkbacks/<TalkBack_ID>/commands/<COMMAND_ID>?api_key=<API_Key>
 *    Replace <TalkBack_ID>, <Command_ID> and <API_Key> by actual values 
 *    (you got from step 3.a, 3.b, 3.c or 3.d respectively)
 *    
 * 6. Upload Program to NodeMCU 1.0 ESP8266 (ESP-12E Module)
 * 7. Open Arduino Serial Monitor on PC (Set Baud Rate to 115200 and set "Both NL & CR"
 ****************************************************************/
/****************************************************************
 * PROGRAM OUTCOME:
 * 
 * BUILT-IN LED on NodeMCU Board should blink with specific interval.
 * 
 * Observe the connection to the thinkspeak server and received msgs 
 * using Serial monitor.
 *  
 ****************************************************************/
 
// Import Libraries
#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266HTTPClient.h>

#define USE_SERIAL Serial     // Set Macro
#define LED_BUILTIN 2

ESP8266WiFiMulti WiFiMulti;   // Create Object of ESP8266WiFiMulti


void setup() {

    pinMode(LED_BUILTIN, OUTPUT);   // set LED_BUILTIN as OUTPUT
    USE_SERIAL.begin(115200);       // NodeMCU to PC communication Baud Rate=115200 
    // USE_SERIAL.setDebugOutput(true);

    USE_SERIAL.println();
    USE_SERIAL.println();
    USE_SERIAL.println();

    for(uint8_t t = 4; t > 0; t--) {                  
        USE_SERIAL.printf("[SETUP] WAIT %d...\n", t); // display msg on PC
        USE_SERIAL.flush();  // wait for a serial string to be finished sending
        delay(1000);         // wait for 1 sec
    }

    WiFiMulti.addAP("TATOOINE-MKT", "Luna2312"); // connect to WiFi
}

void loop() {
    // wait for WiFi connection
    if((WiFiMulti.run() == WL_CONNECTED)) {     // If WiFi is connected
  Serial.println("WiFi connected.");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
        HTTPClient http;                        // Create Object of HTTPClient

        USE_SERIAL.print("[HTTP] begin...\n");  // Display msg on PC

        /*********************** START: LED_ON TALKBAK ***************************/
        // Replace <TalkBack_ID>, <Command_ID> and <API_Key> by actual values here
        http.begin("http://184.106.153.149/talkbacks/32240/commands/15644426?api_key=KG7WJIDG4IW5KPOF"); //HTTP //LED_ON Get a TalkBack Command    

        USE_SERIAL.print("[HTTP] GET...\n");    // Display msg on PC
        
        int httpCode = http.GET();              // start connection and send HTTP header
        // httpCode will be negative on error
        
        if(httpCode > 0) {
            // HTTP header has been send and Server response header has been handled
            USE_SERIAL.printf("[HTTP] GET... code: %d\n", httpCode);

            // file found at server
            if(httpCode == HTTP_CODE_OK){          // check in ESP8266HTTPClient.h . //HTTP_CODE_OK=200
                String payload = http.getString(); // payload = Response from server
                USE_SERIAL.println(payload);       // Display payload on PC 
                
                if(payload=="LED_OFF"){             // If Responcse from server = "LED_OFF"
                  digitalWrite(LED_BUILTIN, HIGH);  // LED OFF (Common Anode)
                }
            
                if(payload=="LED_ON"){             // If Responcse from server = "LED_ON"
                  digitalWrite(LED_BUILTIN, LOW);  // LED ON (Common Anode)
                }
            }
        } 
        else{
            USE_SERIAL.printf("[HTTP] GET... failed, error: %s\n", http.errorToString(httpCode).c_str());  // Display Error msg to PC
        }
        /*********************** END: LED_ON TALKBAK ***************************/        
        
        delay(10000);     // Wait for 10 Sec
        
        /*********************** START: LED_OFF TALKBAK ***************************/
        
        // Replace <TalkBack_ID>, <Command_ID> and <API_Key> by actual values here
        http.begin("http://184.106.153.149/talkbacks/32240/commands/15644428?api_key=KG7WJIDG4IW5KPOF"); //HTTP //LED_OFF Get a TalkBack Command    

        USE_SERIAL.print("[HTTP] GET...\n");    // Display msg on PC
        
        httpCode = http.GET();              // start connection and send HTTP header
        // httpCode will be negative on error
        
        if(httpCode > 0) {
            // HTTP header has been send and Server response header has been handled
            USE_SERIAL.printf("[HTTP] GET... code: %d\n", httpCode);

            // file found at server
            if(httpCode == HTTP_CODE_OK){          // check in ESP8266HTTPClient.h . //HTTP_CODE_OK=200
                String payload = http.getString(); // payload = Response from server
                USE_SERIAL.println(payload);       // Display payload on PC 
                
                if(payload=="LED_OFF"){             // If Responcse from server = "LED_OFF"
                  digitalWrite(LED_BUILTIN, HIGH);  // LED OFF (Common Anode)
                }
            
                if(payload=="LED_ON"){             // If Responcse from server = "LED_ON"
                  digitalWrite(LED_BUILTIN, LOW);  // LED ON (Common Anode)
                }
            }
        } 
        else{
            USE_SERIAL.printf("[HTTP] GET... failed, error: %s\n", http.errorToString(httpCode).c_str());  // Display Error msg to PC
        }
        /*********************** END: LED_OFF TALKBAK ***************************/
        
        http.end();   // Close Connection
    }
    delay(10000);     // Wait for 10 Sec
}
