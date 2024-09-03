import nodemailer from "nodemailer";

export const sendEmail = async (to: string, subject: string = '', text : string = '', html: string = '') => {
    let testEmailAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: testEmailAccount.user,
            pass: testEmailAccount.pass,
        },
    });
    
    let result = await transporter.sendMail({
        from: '"Node js" <nodejs@example.com>',
        to: to,
        subject: subject,
        text: text,
        html: html,
    });
    return result
};