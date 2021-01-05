// WiFi Server für den Arduino der Pickup-Station

// Simon Schröder (stec103616)


#include <SPI.h>
#include <WiFiNINA.h>
#include <stdio.h>

#include "arduino_secrets.h"

// WLAN-Daten in "arduio_secrets.h"
char ssid[] = SECRET_SSID;
char pass[] = SECRET_PASS;

/* Arduino vars */
long time = 0;
byte mac[6];
bool serialVerbunden = 0;
const long restart_time = 3600000;

/* Buffer zum Verarbeiten der Anfragen */
char buffer[100] = { 0 };

typedef enum Funktion {
  UNERKANNT = 0,
  WEITERLEITEN,
  OEFFNEN,
  STATUS_ABFRAGE
} Funktion;

/* Variablen zum verarbeiten der Anfrage */
Funktion funktion;
bool istServer;
int fachNr;

// Server hört Port 80
WiFiServer server(80);

void setup() {
  // Pin für "LED-Output"
  pinMode(LED_BUILTIN, OUTPUT);

  // Serial
  Serial.begin(9600);

  // 6 Sekunden auf serielles Terminal warten
  time = millis() + 6000;
  while (!Serial && (time > millis())) {
    delay(500);
    digitalWrite(LED_BUILTIN, HIGH);
    delay(500);
    digitalWrite(LED_BUILTIN, LOW);
  }

  // Ausgabe deaktivieren für schnellere Server-Antwort
  serialVerbunden = Serial;

  // WiFi Modul prüfen (Keine Versionsprüfung)
  if (WiFi.status() == WL_NO_MODULE) {
    Serial.println("Communication with WiFi module failed!");
    // Nicht fortfahren. Schnelles blinken symbolisiert Fehler
    while (true) {
      delay(200);
      digitalWrite(LED_BUILTIN, HIGH);
      delay(200);
      digitalWrite(LED_BUILTIN, LOW);
    };
  }

  if (serialVerbunden) { // MAC-Adresse ausgeben
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

void loop() {
  // Verbindung zu WLAN herstellen
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print("Verbinden mit WLAN. SSID: ");
    Serial.println(ssid);

    WiFi.begin(ssid, pass);

    if (WiFi.status() != WL_CONNECTED) {
      // 60 Sekunden auf WLAN warten.
      delay(60000);
    }
    else {
      // 1 Sekunde für stabile Verbindung
      delay(1000);
    }
  }

  // WLAN-Daten ausgeben (auch IP-Adresse)
  printWifiStatus(serialVerbunden);

  // Server starten
  server.begin();

  // LED für "bereit" aus
  digitalWrite(LED_BUILTIN, LOW);

  // Nach einiger Zeit Server neustarten und WLAN-Verbindung erneut herstellen
  time = millis() + restart_time;
  while (WiFi.status() == WL_CONNECTED && (time > millis())) {
    WiFiClient client = server.available();
    if (client) {
      digitalWrite(LED_BUILTIN, HIGH);

      funktion = UNERKANNT;
      istServer = false;
      fachNr = -1;

      /* Verarbeitung Anfrage */
      while (client.available() && funktion != WEITERLEITEN && (funktion == UNERKANNT || !istServer)) {
        getWord(client, buffer);

        /* Wort einer Funktion zuordnen */
        if (strcmp(buffer, "GET") == 0) {
          /* "path" erfassen */
          if (client.available()) {
            getWord(client, buffer);
          }

          /* "path" auswerten */
          switch (buffer[1]) {
          case 'o':
            /* Fach öffnen */
            funktion = OEFFNEN;
            fachNr = getInt(buffer + 2);
            break;
          case 's':
            /* Status zurücksenden */
            funktion = STATUS_ABFRAGE;
            break;
          default:
            /* "Falscher Code: weiterleiten zu Webinterface" */
            funktion = WEITERLEITEN;
            break;
          }
        }
        else if (strcmp(buffer, "identification:") == 0) {
          getWord(client, buffer);
          if (buffer == "4ef8487cc93a9a9e") {
            istServer = true;
          }
        }
      }

      while (client.available()) { client.read(); }

      /*
        client.println("HTTP/1.1 301 Moved Permanently");
        client.println("Location: https://pickup-station.stec.fh-wedel.de/");
        client.println();

        client.println("HTTP/1.1 200 OK");
        client.println("Content-Type: application/json");
        client.println("Connection: close"); // the connection will be closed after completion of the response
      */

      // give the web browser time to receive the data
      delay(1);
      client.stop();

      // close the connection:
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

/**
 * "Parsed" eine Zahl aus einem String bis ein Zeichen
 * erkannt wird, welches keine Ziffer ist.
 *
 * @param str String, der geparsed werden soll
 */
int getInt(char* str) {
  bool isNumber = true;
  int res = 0;
  char* ptr = str;
  while (*ptr && isNumber) {
    switch (*ptr) {
    case '0':
      res *= 10;
      break;
    case '1':
      res *= 10;
      res += 1;
      break;
    case '2':
      res *= 10;
      res += 2;
      break;
    case '3':
      res *= 10;
      res += 3;
      break;
    case '4':
      res *= 10;
      res += 4;
      break;
    case '5':
      res *= 10;
      res += 5;
      break;
    case '6':
      res *= 10;
      res += 6;
      break;
    case '7':
      res *= 10;
      res += 7;
      break;
    case '8':
      res *= 10;
      res += 8;
      break;
    case '9':
      res *= 10;
      res += 9;
      break;
    default:
      isNumber = false;
      break;
    }
  }
  return res;
}

/**
 * Liest solange vom Client ein bis ein Leerzeichen,
 * \r oder \n kommt. "Leerraum" wird ersetzt durch \0
 *
 * @param client Client vom dem gelesen werden soll
 * @param buffer Char-Array in das hineingelesen
 * wird. Der Pointer wird nicht verändert.
 */
void getWord(WiFiClient client, char* buffer) {
  char* bufferPtr = buffer;

  int counter = 0;

  bufferPtr--;
  do {
    *++bufferPtr = (char)client.read();
    if (*bufferPtr == '\r') {
      bufferPtr--;
    }
    else {
      if (*bufferPtr == ' ' || *bufferPtr == '\n') {
        *bufferPtr = '\0';
      }
    }
  } while (client.available() && *bufferPtr != ' ' && *bufferPtr != '\n' && counter++ < 100);

  *bufferPtr = '\0';
}

void printWifiStatus(bool serialConnected) {
  if (serialConnected) {
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
}
