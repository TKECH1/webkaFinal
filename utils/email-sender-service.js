import nodemailer from "nodemailer";
import emailConfig from "../config/EmailConfig.js";
import {fileURLToPath} from 'url';
import ejs from "ejs";
import * as path from "path";

console.log("conf "+ JSON.stringify(emailConfig))
const transporter = nodemailer.createTransport(emailConfig)

export const sendMail = async (mailOptions) => {
    try {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);

        const templatePath = path.join(__dirname, '../views/en', mailOptions.template + '.ejs');
        mailOptions.html = await ejs.renderFile(templatePath, mailOptions.data)


        await transporter.sendMail(mailOptions);
    } catch (err) {
        console.error("EmailService: " + err);
        throw err
    }
}