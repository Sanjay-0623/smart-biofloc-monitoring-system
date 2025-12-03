// ESP32 Biofloc Monitoring System
// Sensors: pH, Temperature, Ultrasonic (HC-SR04), Turbidity
// WiFi enabled - Posts data to your server

#include <WiFi.h>
#include <HTTPClient.h>
#include <OneWire.h>
#include <DallasTemperature.h>

// WiFi credentials - CHANGE THESE
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Server endpoint - CHANGE THIS to your domain
const char* serverUrl = "http://your-domain.com/api/predict";  
// For local testing: "http://192.168.1.100:3000/api/predict"

// Pin definitions
#define PH_PIN 34           // Analog pin for pH sensor (ADC1)
#define TEMP_PIN 4          // Digital pin for DS18B20 temperature sensor
#define TRIG_PIN 5          // Ultrasonic sensor trigger pin
#define ECHO_PIN 18         // Ultrasonic sensor echo pin
#define TURBIDITY_PIN 35    // Analog pin for turbidity sensor (ADC1)

// Sensor calibration values - ADJUST THESE FOR YOUR SENSORS
#define PH_NEUTRAL_VOLTAGE 1500   // mV at pH 7.0
#define PH_SLOPE 59.16            // mV per pH unit (theoretical)
#define TANK_HEIGHT_CM 100        // Total tank height in cm

// Temperature sensor setup
OneWire oneWire(TEMP_PIN);
DallasTemperature tempSensor(&oneWire);

// Reading interval (milliseconds)
const unsigned long READING_INTERVAL = 60000; // 1 minute
unsigned long lastReadingTime = 0;

void setup() {
  Serial.begin(115200);
  
  // Initialize pins
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  
  // Initialize temperature sensor
  tempSensor.begin();
  
  // Connect to WiFi
  Serial.println("Connecting to WiFi...");
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("\nWiFi connected!");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  unsigned long currentTime = millis();
  
  // Take readings at specified interval
  if (currentTime - lastReadingTime >= READING_INTERVAL) {
    lastReadingTime = currentTime;
    
    // Read all sensors
    float ph = readPH();
    float temperature = readTemperature();
    float waterLevel = readUltrasonic();
    float turbidity = readTurbidity();
    
    // Print readings to Serial Monitor
    Serial.println("\n========== Sensor Readings ==========");
    Serial.print("pH: "); Serial.println(ph, 2);
    Serial.print("Temperature: "); Serial.print(temperature, 1); Serial.println(" °C");
    Serial.print("Water Level: "); Serial.print(waterLevel, 1); Serial.println(" cm");
    Serial.print("Turbidity: "); Serial.print(turbidity, 1); Serial.println(" NTU");
    Serial.println("====================================\n");
    
    // Send data to server
    if (WiFi.status() == WL_CONNECTED) {
      sendDataToServer(ph, temperature, waterLevel, turbidity);
    } else {
      Serial.println("WiFi disconnected! Reconnecting...");
      WiFi.reconnect();
    }
  }
  
  delay(100);
}

// Read pH sensor
float readPH() {
  int rawValue = analogRead(PH_PIN);
  float voltage = (rawValue / 4095.0) * 3300; // Convert to mV (ESP32 is 12-bit ADC, 3.3V)
  
  // Convert voltage to pH using calibration values
  float ph = 7.0 - ((voltage - PH_NEUTRAL_VOLTAGE) / PH_SLOPE);
  
  // Constrain to valid pH range
  return constrain(ph, 0.0, 14.0);
}

// Read temperature sensor (DS18B20)
float readTemperature() {
  tempSensor.requestTemperatures();
  float temp = tempSensor.getTempCByIndex(0);
  
  // Check for sensor error
  if (temp == DEVICE_DISCONNECTED_C) {
    Serial.println("Temperature sensor error!");
    return 25.0; // Return default value
  }
  
  return temp;
}

// Read ultrasonic sensor (HC-SR04)
float readUltrasonic() {
  // Send pulse
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  
  // Read echo
  long duration = pulseIn(ECHO_PIN, HIGH, 30000); // Timeout 30ms
  
  if (duration == 0) {
    Serial.println("Ultrasonic sensor timeout!");
    return 0;
  }
  
  // Calculate distance in cm (speed of sound = 343 m/s)
  float distance = duration * 0.0343 / 2;
  
  // Calculate water level (tank height - distance to water surface)
  float waterLevel = TANK_HEIGHT_CM - distance;
  
  // Constrain to valid range
  return constrain(waterLevel, 0, TANK_HEIGHT_CM);
}

// Read turbidity sensor
float readTurbidity() {
  int rawValue = analogRead(TURBIDITY_PIN);
  float voltage = (rawValue / 4095.0) * 3.3; // Convert to volts
  
  // Convert voltage to NTU (calibration depends on your sensor)
  // This is a generic formula - adjust based on your sensor's datasheet
  float turbidity = -1120.4 * voltage * voltage + 5742.3 * voltage - 4352.9;
  
  // Constrain to valid range
  return constrain(turbidity, 0, 3000);
}

// Send data to server via HTTP POST
void sendDataToServer(float ph, float temperature, float waterLevel, float turbidity) {
  HTTPClient http;
  
  Serial.println("Sending data to server...");
  
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");
  
  // Create JSON payload
  String jsonPayload = "{";
  jsonPayload += "\"ph\":" + String(ph, 2) + ",";
  jsonPayload += "\"temperature_c\":" + String(temperature, 1) + ",";
  jsonPayload += "\"ultrasonic_cm\":" + String(waterLevel, 1) + ",";
  jsonPayload += "\"turbidity_ntu\":" + String(turbidity, 1);
  jsonPayload += "}";
  
  Serial.println("Payload: " + jsonPayload);
  
  // Send POST request
  int httpResponseCode = http.POST(jsonPayload);
  
  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.println("HTTP Response code: " + String(httpResponseCode));
    Serial.println("Server response: " + response);
  } else {
    Serial.print("Error sending data. HTTP error code: ");
    Serial.println(httpResponseCode);
  }
  
  http.end();
}
