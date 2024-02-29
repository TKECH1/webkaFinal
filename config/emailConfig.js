import * as dotenv from "dotenv";

dotenv.config({path: `.env.${process.env.NODE_ENV}`})

const emailConfig = {
    service: process.env.EMAIL_SERVICE,
    host: "smtp.gmail.com",
    port: process.env.EMAIL_CONFIG_PORT,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
}

export default emailConfig