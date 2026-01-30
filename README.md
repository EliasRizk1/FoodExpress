How to Run the Project (Step-by-Step)
​1️⃣ Start the Backend & Dashboard
​Open the folder named backend in your terminal.
​Run npm install to download dependencies.
​Start the server by running: node server2.js.
​Delivery Dashboard: Once the server is running, the delivery management system is active. This dashboard allows for tracking and managing orders in real-time after a customer places them through the app.
​2️⃣ Open the Frontend (Drag & Drop) 🖱️
​The foodexpress folder contains the Flutter frontend code. To ensure Android Studio recognizes it correctly:
​Open Android Studio.
​Locate your extracted foodexpress folder in your computer's File Explorer.
​Drag the foodexpress folder directly into the Android Studio window.
​Select "Open in New Window" if prompted.
​3️⃣ Update the Backend IP Address 🌐
​The frontend must be connected to the backend server using your local IP:
​In Android Studio, navigate to lib/services/api_service.dart.
​Find the line: static const String baseUrl = 'http://YOUR_IP_HERE:3000/api';.
​Replace the IP address with your computer's local IP (e.g., 192.168.1.111) or use 10.0.2.2 if running on the Android Emulator.
​4️⃣ Fix Code Errors (Pub Get) 🛠️
​Open the file named pubspec.yaml inside the foodexpress folder.
​At the top of the editor, click the blue text "Pub get".
​Once the terminal shows Process finished with exit code 0, all red error lines in the code (like in main.dart) will disappear.
​5️⃣ Launch the App
​Select your device/emulator in the top toolbar.
​Click the Green Play Button.
​📁 Repository Structure
​foodexpress/: The Frontend mobile application (Flutter). Contains all UI screens, login logic, and the cart system.
​backend/: The Backend (Node.js/Express) which handles data, user accounts, and includes the Delivery Dashboard for processing orders.
​Documentation/: Includes the project report, PowerPoint presentation, and video of me running the app on virtual phone and edge browser YOU CAN FIND IT ON MY YTB CHANNEL: https://youtu.be/RDdqFnTujNA
