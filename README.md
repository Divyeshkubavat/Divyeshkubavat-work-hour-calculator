# Daily Work Hour Tracker ⏱️📊

A full-featured **React Native (Expo) mobile application** designed to track daily working hours, view monthly work history, calculate earnings, and export records.  
The app provides a clean, modern UI for logging punch-in and punch-out times and maintaining a structured work log.

This project is ideal for **employees, freelancers, students, and shift-based workers** who want a simple yet powerful way to track work hours.

---

## ✨ Key Features

### 🕒 Daily Work Logging
- Punch **In** and **Out** time selection
- Quick **NOW** button to auto-fill current time
- Date-based entry system
- Save daily work entries securely

### 📆 Work History
- Monthly navigation (Previous / Next month)
- Automatic grouping of records by date
- View daily worked hours with exact In/Out times
- Delete individual daily records

### 📊 Visual Analytics
- Daily hours bar chart for each month
- Easy-to-read visual comparison of work duration
- Helps analyze productivity trends

### 🧮 Monthly Summary & Salary Calculation
- Displays **total hours worked per month**
- Enter hourly rate (₹)
- Instantly calculate total earnings for the month

### 📁 Data Management
- Export monthly work data to **CSV**
- Reset all app data with one action
- Handles empty months gracefully (No records found)

---

## 📱 App Screens Overview

### 🏠 Home – Daily Tracker
- Greeting based on time (Good Morning / Afternoon)
- Date selector
- Punch In / Punch Out cards
- Save Entry button
- Navigate to Work History

### 📜 Work History Screen
- Month selector (January, February, etc.)
- Daily Hours Summary chart
- Month total hours
- Hourly rate input and Calculate button
- Daily records list with delete option
- Export to CSV
- Reset all app data

---

## 🛠️ Tech Stack

- **React Native**
- **Expo**
- **JavaScript**
- **Local Storage (Async Storage)**
- **Chart Library** (for daily hours visualization)

---

## 📁 Project Structure

```text
Divyeshkubavat-work-hour-calculator/
├── assets/      # App images & icons
├── src/
│   ├── components/ # Reusable UI components
│   ├── screens/    # Home & History screens
│   ├── utils/      # Time, date & calculation helpers
│   └── storage/    # Local data handling
├── App.js          # App entry point
├── app.json        # Expo configuration
├── package.json    # Dependencies
└── README.md
```
---

## 📦 Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Divyeshkubavat/Divyeshkubavat-work-hour-calculator.git
cd Divyeshkubavat-work-hour-calculator

npm install
# or
yarn install

npm start
# or
yarn start
```

### ▶️ Running the Application

Expo Developer Tools will open automatically.  
You can run the app on:

* 📱 **Android Emulator**
* 📱 **iOS Simulator**
* 📱 **Expo Go app** (scan QR code on your mobile)

### 📊 Usage Flow

1. **Open the app** and select the date
2. **Punch In** and **Out** time
3. **Save** the daily entry
4. Go to **Work History**
5. **Navigate** through months
6. **View** daily chart & total hours
7. **Enter hourly rate** to calculate earnings
8. **Export data to CSV** if required

## 📸 App Screenshots

<p align="center">
  <img src="https://github.com/user-attachments/assets/154d0e06-a339-4be4-b298-3bd4cbdfcc01" width="180" />
  <img src="https://github.com/user-attachments/assets/ec851b5d-2a86-4339-a6bd-14e8f4d67f52" width="180" />
  <img src="https://github.com/user-attachments/assets/d90e86e5-638c-4cf0-88a8-f0f1d8b2741b" width="180" />
  <img src="https://github.com/user-attachments/assets/3b0453a4-e558-4f52-96c7-9a109647cc74" width="180" />
</p>

## 📄 Data Storage

* **Local Storage:** All work records are stored locally on the device.
* **Offline First:** No internet connection required.
* **Persistence:** Data persists across app restarts.
* **Clearance:** Reset option clears all stored records.

## 🛡️ Contributing

Contributions are welcome! To contribute:

1.  **Fork** the repository.
2.  **Create a feature branch**:
    ```bash
    git checkout -b feature/new-feature
    ```
3.  **Commit** your changes.
4.  **Push** to your fork.
5.  **Open a Pull Request**.

## 📄 License

This project is open source and free to use for personal and educational purposes.

## ❤️ Acknowledgements

* **React Native community** for mobile development support.
* **Expo team** for simplifying cross-platform builds.
* **Open-source contributors** for inspiration and tools.

## 👤 Author

**Divyesh Kubavat**

* **GitHub:** [https://github.com/Divyeshkubavat](https://github.com/Divyeshkubavat)
