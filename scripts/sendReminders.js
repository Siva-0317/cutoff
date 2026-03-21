const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

// Firebase service account from environment variable
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

async function sendReminders() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const snapshot = await db.collection("subscriptions").get();

  for (const docSnap of snapshot.docs) {
    const sub = docSnap.data();
    const subRef = docSnap.ref;

    if (!sub.endDate || !sub.email) continue;

    const endDate = new Date(sub.endDate);
    endDate.setHours(0, 0, 0, 0);

    const daysLeft = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

    const reminders = [
      { days: 5, field: "reminderSent5" },
      { days: 3, field: "reminderSent3" },
      { days: 1, field: "reminderSent1" },
    ];

    for (const reminder of reminders) {
      if (daysLeft === reminder.days && !sub[reminder.field]) {
        await transporter.sendMail({
          from: `"Cutoff Reminders" <${process.env.GMAIL_USER}>`,
          to: sub.email,
          subject: `⏰ Reminder: ${sub.name} expires in ${daysLeft} day${daysLeft > 1 ? "s" : ""}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px; border-radius: 12px; border: 1px solid #eee;">
              <h2 style="color: #1a7f6e;">Cutoff Reminder</h2>
              <p>Hey there! Just a heads up:</p>
              <div style="background: #f0f4f8; padding: 16px; border-radius: 8px; margin: 16px 0;">
                <strong>${sub.name}</strong>${sub.platform ? ` (${sub.platform})` : ""}<br/>
                <span style="color: #d97706; font-weight: bold;">
                  Expires in ${daysLeft} day${daysLeft > 1 ? "s" : ""}
                </span> — on ${sub.endDate}<br/>
                ${sub.cost ? `Monthly cost: ₹${sub.cost}` : ""}
              </div>
              <p>Don't forget to renew or cancel before it expires!</p>
              <p style="color: #aaa; font-size: 12px;">— Cutoff Subscription Manager</p>
            </div>
          `,
        });

        await subRef.update({ [reminder.field]: true });
        console.log(`✅ Sent ${reminder.days}-day reminder for "${sub.name}" to ${sub.email}`);
      }
    }
  }

  console.log("Done checking all subscriptions.");
  process.exit(0);
}

sendReminders().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});