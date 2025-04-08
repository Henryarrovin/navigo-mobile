# Navigo Mobile
## Indoor Navigation / Positioning System Mobile App

![React Native](https://img.shields.io/badge/React%20Native-Mobile-blue?logo=react)
![Bun](https://img.shields.io/badge/Bun-Package%20Manager-ff69b4?logo=bun)
![Expo](https://img.shields.io/badge/Expo-Framework-000020?logo=expo)
![Redux](https://img.shields.io/badge/State_Management-Redux-764ABC?logo=redux)
![TypeScript](https://img.shields.io/badge/TypeScript-Supported-blue?logo=typescript)

Mobile app for real-time indoor positioning and product navigation using React Native.  
Uses phone sensors and QR codes for Pedestrian Dead Reckoning (PDR) to help users navigate indoors.

## ✨ Features

- **PDR Navigation** using accelerometer, gyroscope & magnetometer
- **QR Code Positioning** for initial calibration
- **SVG Map** with zone visualization
- **Real-time Pathfinding** with A* algorithm
- **Celebration Effects** when reaching destinations

## 🧮 Algorithms & Formulas

### PDR Algorithms
```javascript
export function detectSteps(accelerationData) {
  const threshold = 1.2;
  let stepCount = 0;
  let lastMagnitude = 0;
  
  accelerationData.forEach((acc) => {
    const magnitude = Math.sqrt(acc.x**2 + acc.y**2 + acc.z**2);
    const smoothed = lowPass(magnitude, lastMagnitude, 0.8);
    
    if (smoothed > threshold && !wasAbove) {
      stepCount++;
    }
    lastMagnitude = smoothed;
  });
  return stepCount;
}
```

### Sensor Fusion
```javascript
// Magnetometer heading
const heading = Math.atan2(mag.y, mag.x) * (180 / Math.PI);

// Gyroscope integration
const gyroHeading = currentHeading + (gyro.z * dt);

// Complementary filter
const fusedHeading = alpha * gyroHeading + (1-alpha) * magnetHeading;
```

- ### 📱 Mobile Sensors Used

| Sensor        | Purpose               | Update Interval |
|---------------|-----------------------|-----------------|
| Accelerometer | Step detection        | 10ms            |
| Gyroscope     | Rotation tracking     | 50ms            |
| Magnetometer  | Absolute heading      | 50ms            |
| Camera        | QR scanning           | N/A             |

### Position Update
```javascript
function calculateNewPosition(current, stepLength, heading) {
  const rad = (heading * Math.PI) / 180;
  return {
    x: current.x + stepLength * Math.sin(rad),
    y: current.y - stepLength * Math.cos(rad)
  };
}
```

## 📦 API Endpoints Used from backend

### 🔹 Products
- `GET /api/products` - Get all products (paginated)  
- `GET /api/products/:id` - Get product by ID  
- `GET /api/products/category/:categoryId` - Get products by category 

### 🔹 Categories
- `GET /api/categories` - Get all categories  

### 🔹 Map / Navigation
- `POST /api/map/path` - Find path between two points 
- `GET /api/map/zones` - Get all zones

---

## 📦 Key Components

### 🗺 MapRenderer

- SVG-based map visualization
- Zone coloring and labeling
- Real-time position markers

### 🚶 PDRService

- Sensor data collection
- Step detection algorithm
- Heading estimation
- Position tracking

### 🎯 NavigationService

- Pathfinding integration
- Distance calculation
- Destination handling
- Celebration triggers

---

## ⚙️ Technical Implementation

### 🐳 Docker Deployment

- Run the application in a container using the prebuilt Docker image:
  ```bash
  Under Development
  ```

### 💻 Local Development

- Clone the repository
  ```bash
  git clone https://github.com/NaviGoProject/navigo-mobile.git
  ```
- Create a .env file in the root directory:
   ```env
   API_BASE_URL="http://<system-ip>:<port-exposed>/api"
   ```
- Install dependencies:
  ```bash
  bun install
  ```
- Start the expo app:
  ```bash
  bun run start
  ```

### 🛠 Tech Stack️

- Language: TypeScript
- Framework: React Native (with Expo)
- State Management: Redux Toolkit
- Data Visualization: React Native SVG
- Animation: Lottie for React Native
- Hardware Access: Expo Sensors
- Navigation: expo-router
- Build Tool: Metro Bundler