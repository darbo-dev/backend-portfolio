import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import nodemailer from 'nodemailer'
import cors from 'cors'

const app = express()
app.use(express.json())
app.use(cors({
    credentials: true,
    origin: ['https://portfolio-frontend-seven-fawn.vercel.app', 'http://localhost:5173'],
}))

app.post('/api/contact', async (req,res) => {
    const {name, email, message} = req.body
    if(!name || !email || !message) {
        return res.status(400).json({
            success: false,
            mmessage: "All fields required"
        })
    }

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.USER_EMAIL,
                pass: process.env.APP_PASSWORD
            }

        })
        const mailOptions = {
            from: email,
            to: 'darborzgar7@gmail.com',
            subject: `New message from ${email}`,
            text: `name: ${name} \n email: ${email} \n message: ${message}`
        }   

        await transporter.sendMail(mailOptions)

            res.status(200).json({ success: true, mmessage: "Message sent successfully!" });
    } catch (error) {
            res.status(500).json({ success: false, mmessage: "Server error" });
    }

})

app.listen(8000, () => {
    console.log(`server: http://localhost:8000`)
})