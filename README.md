# 📱 iOS Blockchain Learning Hub

Welcome to the **Blockchain Learning Hub** mobile application, developed using **Swift** for iOS and **Node.js** for the backend. This app is designed to engage users in discussions on blockchain technology while providing modern features for an enhanced user experience.

## 🚀 Features

- **📚 Learn about Blockchain:** Access educational content and discussions about blockchain technology.
- **💬 Messaging:** Stay connected with other users through real-time messaging.
- **🔒 Face ID Authentication:** Secure user authentication using **Facial Recognition (Face ID)**.
- **🌍 Multilingual Support:** Experience the app in multiple languages.
- **🗺️ Map Integration:** Interactive map to explore blockchain-related locations and discussions.
- **🎨 Modern UI:** Utilizes both **SwiftUI** and **Storyboard** to create a fluid and engaging user interface.

## 🛠️ Tech Stack

- **Frontend:** Swift (SwiftUI, Storyboard)
- **Backend:** Node.js
- **Database:** MongoDB

## 📝 Setup Instructions

 **Clone the Repository:**
   ```bash
   git clone https://github.com/safwenbarhoumi/Mini_Project_IOS_LastVersion
```
```
cd Mini_Project_IOS_LastVersion
```

* Backend Setup
Navigate to Backend Directory

```
cd backend
```
Install Dependencies

```
npm i
```

Environment Configuration :
Create a .env file in the backend directory:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/blockchain_hub
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
SOCKET_PORT=3001
```

Run Backend Server

```
npm start
# or for development with nodemon
npm run dev
```

* iOS App Setup
Navigate to iOS Project Directory

```
cd ../ios
```
Install Dependencies
Using CocoaPods:
```
pod install
```
Using Swift Package Manager:
Open the project in Xcode and dependencies will be resolved automatically.

Configuration

Open BlockchainHub.xcworkspace (if using CocoaPods) or BlockchainHub.xcodeproj
Update the backend URL in Config.swift:

```
struct Config {
    static let baseURL = "http://localhost:3000" // For simulator
    // static let baseURL = "http://YOUR_IP:3000" // For physical device
    static let socketURL = "http://localhost:3001"
}
```

Face ID Setup
Add the following to Info.plist:

```
<key>NSFaceIDUsageDescription</key>
<string>This app uses Face ID for secure authentication</string>
```
**Happy Coding! 🚀**
