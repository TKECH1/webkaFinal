import bcrypt from "bcrypt";
import UserService from "../services/user-service.js";
import {sendMail} from "../utils/email-sender-service.js";

const userService = new UserService()

export default class AuthController {

    registrationPage = async (req, res) => {
        res.render("en/registration")
    }
    registration = async (req, res) => {
        try {
            const {email, password} = req.body

            // Check if user already exists
            const existingUser = await userService.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({message: 'User already exists'});
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create a new user
            await userService.createUser({
                email,
                password: hashedPassword
            });

            const mailOptions = {
                from: 'tmtmtm1423@gmail.com',
                to: email,
                subject: "Registration successful",
                template: 'register-email',
                data: {
                    content: `${email}, your account has been registered!`,
                }
            }

            try {
                await sendMail(mailOptions)
            } catch (err) {
                console.error("EmailController: " + err)
                res.status(500).json({emailController: err})
            }

            res.redirect("/auth/login")
        } catch (error) {
            res.status(500).json({messa3ge: error.message});
        }

    };

    loginPage = async (req, res) => {
        res.render("en/login.ejs")
    }

    login = async (req, res) => {
        const {email, password} = req.body;

        console.log(email, password)

        console.log("session: " + req.session)

        try {
            // 1. Find the user
            const user = await userService.findByEmail(email);
            if (!user) {
                return res.status(401).send('Invalid credentials');
            }

            // 2. Compare passwords
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).send('Invalid credentials');
            }

            // 3. Initiate session
            req.session.userId = user._id;
            req.session.lang = "en"

            res.redirect("/")
        } catch (error) {
            console.error(error);
            res.status(500).send('Login failed: ' + error);
        }
    };
}