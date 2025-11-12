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

app.get('/', (req, res) => {
    res.json({ message: 'Backend is running!' })
})

app.post('/api/contact', async (req,res) => {
    const {name, email, message} = req.body
    if(!name || !email || !message) {
        return res.status(400).json({
            success: false,
            message: "All fields required"  // Fixed typo: mmessage → message
        })
    }

    try {
    
        if (!process.env.USER_EMAIL || !process.env.APP_PASSWORD) {
            console.log('Missing email credentials')
            return res.status(500).json({ 
                success: false, 
                message: "Email service not configured" 
            })
        }

        const transporter = nodemailer.createTransporter({
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
            text: `Name: ${name} \nEmail: ${email} \nMessage: ${message}`
        }   

        await transporter.sendMail(mailOptions)
        res.status(200).json({ success: true, message: "Message sent successfully!" });  // Fixed typo

    } catch (error) {
        console.error('Email error:', error)
        res.status(500).json({ success: false, message: "Server error" });  // Fixed typo
    }
})


const PORT = process.env.PORT || 8000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`)
})