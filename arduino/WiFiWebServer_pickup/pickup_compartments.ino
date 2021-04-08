#include <Wire.h>
#include <Adafruit_PWMServoDriver.h>
#include <Adafruit_NeoPixel.h>


// müssen angepasst werden, je nach anzahl an fächern

#define compartmentNum 1    //
const int compartmentButtons[compartmentNum] = { 8 }; // the pin for the button in each compartment
int compartmentOpen[compartmentNum] = {}; // saves if the compartment is open or closed
int compartmentReserved[compartmentNum] = { false }; // saves if the compartment is reserved or not


//**************************

#define colorFree    pixels.Color(0, 255, 0)
#define colorOpen      pixels.Color(255, 255, 255)
#define colorReserved  pixels.Color(255, 0, 0)
#define colorUnknown  pixels.Color(0, 0, 255)
#define LEDPIN         5  //LED pin
#define LEDPROCOM      20    //LEDs pro fach
#define SERVOMIN       350 // This is the 'minimum' pulse length count (out of 4096)
#define SERVOMAX       500 // This is the 'maximum' pulse length count (out of 4096)
#define USMIN          600 // This is the rounded 'minimum' microsecond length based on the minimum pulse of 150
#define USMAX          2400 // This is the rounded 'maximum' microsecond length based on the maximum pulse of 600
#define SERVO_FREQ     50 // Analog servos run at ~50 Hz updates

Adafruit_PWMServoDriver pwm = Adafruit_PWMServoDriver();

Adafruit_NeoPixel pixels = Adafruit_NeoPixel(LEDPROCOM * compartmentNum, LEDPIN, NEO_GRB + NEO_KHZ800);

/**

*/
void setupCompartments() {
  pixels.begin();
  pwm.begin();
  for (int i = 0; i < compartmentNum; i++) {
    pinMode(compartmentButtons[i], INPUT_PULLUP);
    delay(10);
  }
  pwm.setOscillatorFrequency(27000000);
  // Analog servos run at ~50 Hz updates
  pwm.setPWMFreq(SERVO_FREQ);
  delay(100);


  for (int j = 0; j < compartmentNum; j++) {

    // turn LED on:
    for (int i = LEDPROCOM * j; i < LEDPROCOM + LEDPROCOM * j; i++) {
      pixels.setPixelColor(i, colorUnknown);
      pixels.show();
    }
  }
}



/**
  opens the door of the given compartment
  takes 1 second
*/
void openDoor(int comp) {
  for (uint16_t pulselen = SERVOMAX; pulselen > SERVOMIN; pulselen--) {
    pwm.setPWM(comp, 0, pulselen);
  }

  delay(1000);
  for (uint16_t pulselen = SERVOMIN; pulselen < SERVOMAX; pulselen++) {
    pwm.setPWM(comp, 0, pulselen);
  }
  reserveCompartment(comp);
}
/**
  checks all compartments if they are open
  sets copmpartmentOpen[] to true or false for each compartment
*/
int* check() {
  for (int j = 0; j < compartmentNum; j++) {
    int buttonState = digitalRead(compartmentButtons[j]);
    if (buttonState == HIGH) {
      compartmentOpen[j] = true;
      // turn LED on:
      for (int i = LEDPROCOM * j; i < LEDPROCOM + LEDPROCOM * j; i++) {
        pixels.setPixelColor(i, colorOpen);
        pixels.show();
      }
    } else {
      compartmentOpen[j] = false;
      // turn LED off:
      if (compartmentReserved[j]) {
        for (int i = LEDPROCOM * j; i < LEDPROCOM + LEDPROCOM * j; i++) {
          pixels.setPixelColor(i, colorReserved);
          pixels.show();
        }
      } else {
        for (int i = LEDPROCOM * j; i < LEDPROCOM + LEDPROCOM * j; i++) {
          pixels.setPixelColor(i, colorFree);
          pixels.show();
        }
      }
    }
  }

  return compartmentOpen;
}

/**
   gibt ein Fach frei
*/
void freeCompartment(int comp) {
  compartmentReserved[comp] = false;
  check();
}
/**
   reserviert ein Fach
*/
void reserveCompartment(int comp) {
  compartmentReserved[comp] = true;
  check();
}

/**
   Gibt die Anzahl Fächer zurück
*/
int compNum() {
  return compartmentNum;
}
