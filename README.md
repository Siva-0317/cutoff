# 🛡️ Cutoff - Subscription Manager

**Cutoff** is a premium subscription tracking application that helps you stay on top of your recurring services and avoid unexpected charges with automated email reminders.

## 🚀 Key Features
- **Smart Reminders**: Automated emails sent 5, 3, and 1 day before any subscription expires.
- **Unified Dashboard**: Manage all your subscriptions (Netflix, Spotify, Gym, etc.) in one place.
- **Spending Insights**: Track your monthly costs and active subscriptions at a glance.
- **Chrome Extension Support**: Slimmed-down popup view for quick additions.

## 📖 Documentation
For a deep dive into the system architecture, frontend/backend implementation details, and setup process, please refer to the:
- **[Detailed Architecture Documentation (ARCHITECTURE.md)](./ARCHITECTURE.md)**

## 🛠️ Tech Stack
- **Frontend**: React 19, React Router, Firebase JS SDK
- **Backend**: Firebase Firestore, Firebase Auth
- **Automation**: GitHub Actions (Cron), Node.js, Nodemailer

## 🚦 Quick Start

### 1. Install Dependencies
```bash
npm install
cd scripts
npm install
cd ..
```

### 2. Configure Firebase
Update the Firebase configuration in `src/firebase.js` or provide environment variables for your project.

### 3. Run Locally
```bash
npm start
```

## 🤖 Automation Notes
The reminder system is powered by a GitHub Action defined in `.github/workflows/reminders.yml`. It runs daily to check for expiring subscriptions and sends notifications via Gmail SMTP.

---
*Built with React & Firebase*

