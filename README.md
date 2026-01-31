# How to Run the Project (Step by Step)

## 1. Start the Backend & Delivery Dashboard

1. Open a terminal and navigate to the **backend** folder.
2. Install the required dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   node server2.js
   ```

### Delivery Dashboard
Once the server is running, the **delivery management system** becomes active.  
This dashboard allows tracking and managing orders in real time after customers place them through the mobile application.

---

## 2. Open the Frontend (Drag & Drop Method)

The `foodexpress` folder contains the **Flutter frontend** code.  
To ensure Android Studio recognizes the project correctly:

1. Open **Android Studio**.
2. Locate the extracted `foodexpress` folder on your computer.
3. Drag and drop the `foodexpress` folder directly into the Android Studio window.
4. Select **“Open in New Window”** if prompted.

---

## 3. Update the Backend IP Address

The frontend must connect to the backend server using your local IP address.

1. In Android Studio, navigate to:
   ```
   lib/services/api_service.dart
   ```
2. Locate the following line:
   ```dart
   static const String baseUrl = 'http://YOUR_IP_HERE:3000/api';
   ```
3. Replace `YOUR_IP_HERE` with your computer’s local IP address  
   (e.g., `192.168.1.111`), or use `10.0.2.2` if running on the Android Emulator.

---

## 4. Resolve Dependencies (Pub Get)

1. Open the `pubspec.yaml` file inside the `foodexpress` folder.
2. Click **“Pub get”** at the top of the editor.
3. When the terminal shows:
   ```
   Process finished with exit code 0
   ```
   all dependency-related errors will be resolved.

---

## 5. Launch the Application

1. Select your device or emulator from the top toolbar.
2. Click the **green Play button** to run the application.

---

# Repository Structure

```
foodexpress/
```
Flutter-based mobile frontend application.  
Contains all UI screens, authentication logic, and the cart system.

```
backend/
```
Node.js / Express backend responsible for data handling, user accounts, and the delivery dashboard used to process orders.

```
Documentation/
```
Contains the project report, PowerPoint presentation, and a video demonstration of the application running on a virtual Android device and Edge browser.

## Demo Video

The demo video is available in this GitHub repository and on YouTube:  
https://youtu.be/CdU5-koF6yw
