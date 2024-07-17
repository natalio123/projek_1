#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>

const char* ssid = "wifi_ssid";
const char* password = "wifi_password";
const char* serverUrl = "http://localhost:3400/update-status";

#define DHTPIN 4     // Pin tempat sensor DHT dihubungkan
#define DHTTYPE DHT22   // Tipe sensor DHT yang digunakan (DHT11 atau DHT22)
DHT dht(DHTPIN, DHTTYPE);

WiFiClient client;
HTTPClient http;

void setup() {
  Serial.begin(9600);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");

  // Inisialisasi sensor DHT
  dht.begin();
  Serial.println("DHT sensor initialized");

  // Inisialisasi HTTP client
  Serial.println("Initializing HTTP client...");
  http.begin(client, serverUrl);
  Serial.println("HTTP client initialized");
}

void loop() {
  // Baca suhu dari sensor DHT
  float temperature = dht.readTemperature();
  if (isnan(temperature)) {
    Serial.println("Failed to read from DHT sensor!");
    delay(1000);
    return;
  }

  // Konversi suhu ke String
  String temperatureString = String(temperature);
  String requestBody = "{\"temperature\":\"" + temperatureString + "\",\"status\":\"ON\"}";

  // Kirim data ke server
  http.addHeader("Content-Type", "application/json");
  int httpResponseCode = http.POST(requestBody);
  if (httpResponseCode > 0) {
    Serial.println("Data sent to server successfully");
  } else {
    Serial.println("Error sending data to server");
  }

  delay(10000); // Tunggu 10 detik sebelum mengirim data berikutnya
}
