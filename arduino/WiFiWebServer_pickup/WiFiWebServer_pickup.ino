/*
  WiFi Server für den Arduino der Pickup-Station

  Simon Schröder (stec103616)
*/

#include <SPI.h>
#include <WiFiNINA.h>

#include "arduino_secrets.h"

// WLAN-Daten in "arduio_secrets.h"
char ssid[] = SECRET_SSID;
char pass[] = SECRET_PASS;

long time = 0;
byte mac[6];
bool serial_verbunden = 0;
const long restart_time = 60000;

// Server hört Port 80
WiFiServer server(80);

void setup()
{
  // Pin für "LED-Output"
  pinMode(LED_BUILTIN, OUTPUT);

  // Serial
  Serial.begin(9600);

  // 6 Sekunden auf serielles Terminal warten
  time = millis() + 6000;
  while (!Serial && (time > millis()))
  {
    delay(500);
    digitalWrite(LED_BUILTIN, HIGH);
    delay(500);
    digitalWrite(LED_BUILTIN, LOW);
  }

  // Ausgabe deaktivieren für schnellere Server-Antwort
  serial_verbunden = Serial;

  // WiFi Modul prüfen (Keine Versionsprüfung)
  if (WiFi.status() == WL_NO_MODULE)
  {
    Serial.println("Communication with WiFi module failed!");
    // Nicht fortfahren. Schnelles blinken symbolisiert Fehler
    while (true)
    {
      delay(200);
      digitalWrite(LED_BUILTIN, HIGH);
      delay(200);
      digitalWrite(LED_BUILTIN, LOW);
    };
  }

  // MAC-Adresse ausgeben
  {
    WiFi.macAddress(mac);
    Serial.print("MAC: ");
    Serial.print(mac[5], HEX);
    Serial.print(":");
    Serial.print(mac[4], HEX);
    Serial.print(":");
    Serial.print(mac[3], HEX);
    Serial.print(":");
    Serial.print(mac[2], HEX);
    Serial.print(":");
    Serial.print(mac[1], HEX);
    Serial.print(":");
    Serial.println(mac[0], HEX);
  }

  // LED für "nicht bereit" an
  digitalWrite(LED_BUILTIN, HIGH);
}

void loop()
{
  // Verbindung zu WLAN herstellen
  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.print("Verbinden mit WLAN. SSID: ");
    Serial.println(ssid);

    WiFi.begin(ssid, pass);

    if (WiFi.status() != WL_CONNECTED)
    {
      // 20 Sekunden auf WLAN warten.
      delay(20000);
    }
    else
    {
    // 1 Sekunde für stabile Verbindung
      delay(1000);
    }
  }

  // WLAN-Daten ausgeben (auch IP-Adresse)
  printWifiStatus();

  // Server starten
  server.begin();

  // LED für "bereit" aus
  digitalWrite(LED_BUILTIN, LOW);

  // Nach einiger Zeit Server neustarten und WLAN-Verbindung erneut herstellen
  time = millis() + restart_time;
  while (WiFi.status() == WL_CONNECTED && (time > millis()))
  {
    WiFiClient client = server.available();
    if (client)
    {
      digitalWrite(LED_BUILTIN, HIGH);
      Serial.println("new client");
      // an http request ends with a blank line
      boolean currentLineIsBlank = true;
      while (client.connected())
      {
        if (client.available())
        {
          char c = client.read();

          if (serial_verbunden)
          {
            Serial.write(c);
          }
          // if you've gotten to the end of the line (received a newline
          // character) and the line is blank, the http request has ended,
          // so you can send a reply
          if (c == '\n' && currentLineIsBlank)
          {
            if (0)
            {
              client.println("HTTP/1.1 301 Moved Permanently");
              client.println("Location: https://pickup-station.stec.fh-wedel.de/");
              client.println();
            }

            if (1)
            {
              client.println("HTTP/1.1 200 OK");
              client.println("Content-Type: text/html");
              client.println("Connection: close"); // the connection will be closed after completion of the response
              // client.println("Refresh: 2");        // refresh the page automatically every 5 sec
              client.println();
              client.println("<!DOCTYPE HTML>");
              client.println("<html>");
              client.println(millis());
              if (0) // Ausgabe der Werte analoger Pins deaktivieren
              {      // output the value of each analog input pin
                for (int analogChannel = 0; analogChannel < 6; analogChannel++)
                {
                  int sensorReading = analogRead(analogChannel);
                  client.print("analog input ");
                  client.print(analogChannel);
                  client.print(" is ");
                  client.print(sensorReading);
                  client.println("<br />");
                }
              }
              client.println("</html>");
            }
            break;
          }
          if (c == '\n')
          {
            // you're starting a new line
            currentLineIsBlank = true;
          }
          else if (c != '\r')
          {
            // you've gotten a character on the current line
            currentLineIsBlank = false;
          }
        }
      }
      // give the web browser time to receive the data
      delay(1);

      // close the connection:
      client.stop();
      Serial.println("client disconnected");
      digitalWrite(LED_BUILTIN, LOW);
    }
  }

  // LED für "nicht bereit" an
  digitalWrite(LED_BUILTIN, HIGH);

  // Server neustarten und WLAN Verbindung erneut herstellen
  Serial.println("Neustart (WLAN & Server)");
  WiFi.disconnect();
  WiFi.end();
  delay(1000);

  // Neue Startzeit setzen
  time = millis() + restart_time;
}

void printWifiStatus()
{
  Serial.println("----------------------------------");

  // SSID ausgeben
  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());

  // IP-Adresse ausgeben
  IPAddress ip = WiFi.localIP();
  Serial.print("IP Adresse: ");
  Serial.println(ip);

  // Signalstärke ausgeben
  long rssi = WiFi.RSSI();
  Serial.print("Signalstärke (RSSI):");
  Serial.print(rssi);
  Serial.println(" dBm");

  Serial.println("----------------------------------\n");
}
