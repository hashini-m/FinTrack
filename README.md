# 📊 FinTrack – Personal Finance Tracker

FinTrack is a mobile app built with **React Native + Expo** to help users manage their income, expenses, and gain insights with analytics.  
It supports **offline-first mode**, cloud sync with Firebase, and a modern **UI/UX with reusable custom components**.

---

## 🚀 Features
- 📌 **User Authentication** – Sign up / Log in with Firebase Auth  
- 💸 **Add Transactions** – Record expenses & income with category, notes, photo, and location  
- 🗂️ **Categories** – Organize spending by categories (Food, Bills, Transport, etc.)  
- 📉 **Analytics Dashboard** – Pie chart (expenses by category), bar chart (monthly comparison), progress ring (spent vs income)  
- 🔄 **Offline Support** – Transactions stored in **SQLite** and synced when online  
- 📍 **Native Hardware** – Camera for receipts, GPS for location, push notifications reminders  
- 🎨 **Polished UI** – Custom buttons, cards, headers, and modern fintech-style design  

---

## 🏗️ Architecture & Design
- **Frontend**: React Native (Expo) + React Navigation + React Native Paper  
- **Backend**: Firebase (Authentication + Firestore/Realtime Sync)  
- **Local Storage**: Expo SQLite (offline-first)  
- **Notifications**: Expo Notifications (daily reminders)  
- **Design**: Modular custom components (e.g., `CustomButton`, `FormInput`, `HeaderRibbon`)  

### Data Flow
1. User adds a transaction → saved locally in SQLite.  
2. If online → syncs with Firebase immediately.  
3. If offline → marked as `pending` and synced when network is restored.  

---

## ⚙️ Installation

### 1. Clone the repository
```sh
git clone https://github.com/yourusername/fintrack.git
cd fintrack
