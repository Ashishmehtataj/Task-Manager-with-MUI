import nodemailer from "nodemailer";

export const sendEmail = async (to: string, subject: string, text: string): Promise<void> => {
    try {
        if (!process.env.SMTP_HOST) {
            console.log("SMTP_HOST is not configure")
            console.log("To", to),
                console.log("Subject", subject)
            console.log("Text", text)
            return;
        }
        const createTransport = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: Number(process.env.SMTP_PORT) === 465,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        })
        await createTransport.sendMail({ from: process.env.SMTP_FROM, to, subject, text })
        console.log("Email send success")
    } catch (err: any) {
        console.log("Email send failed " + err.message)
    }
}