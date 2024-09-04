import nodemailer from "nodemailer";

export const sendEmail = async (to: string, subject: string = '', text : string = '', html: string = '') => {
    let testEmailAccount = await nodemailer.createTestAccount();
console.log('testEmailAccount',testEmailAccount)
    let transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            type: 'OAuth2',
            user: 'zernov3273@gmail.com', // Your Gmail email address
            clientId: '443870695700-9t4mpdtt7v5gj7669o1v24s61kopsajf.apps.googleusercontent.com', // OAuth 2.0 client ID
            clientSecret: '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', // OAuth 2.0 client secret
            refreshToken: '1//04Q70FZO6xO16CgYIARAAGAQSNwF-L9IrgJZXDAs9AwMV8mPWDvTtoUoiTob1VEGbFKyEN6Jmtu4S08r6KF1gQYM_lFQgCNYRJxw' // OAuth 2.0 refresh token
          }
    });
    /*
     let transporter = nodemailer.createTransport({
        host: "smtp.yandex.ru",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.emailAddress, // generated ethereal user
            pass: process.env.emailPassword // generated ethereal password
        }
    });
    */
    let result = await transporter.sendMail({
        from: '"Node js" <zernov3273@gmail.com>',
        to: to,
        subject: subject,
        text: text,
        html: html,
    });
    return result
};