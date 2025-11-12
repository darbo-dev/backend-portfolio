import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: ["https://darbazdev.vercel.app"],
  methods: ["POST", "GET"],
  credentials: true,
}));

app.get("/", (req, res) => res.send("Backend running ✅"));

app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.resend.com",
      port: 587,
      auth: {
        user: "resend",
        pass: process.env.RESEND_API_KEY,
      },
    });

    await transporter.sendMail({
      from: "portfolio@resend.dev", 
      to: "darborzgar7@gmail.com", 
      subject: `Portfolio Message from ${name}`,
      text: `From: ${email}\n\n${message}`,
    });

    res.status(200).json({ success: true, message: "Message sent successfully ✅" });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ success: false, message: "Failed to send message ❌" });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));