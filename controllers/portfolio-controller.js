import PortfolioService from "../services/portfolioService.js";
import upload from "../utils/image-uploader.js";
import multer from "multer";
import * as dotenv from "dotenv";
import UserService from "../services/user-service.js";

const projectRepository = new PortfolioService()
const userService = new UserService()
dotenv.config({path: `.env.${process.env.NODE_ENV}`})

export default class PortfolioController {

    getAllProjects = async (req, res) => {
        const {email} = await userService.findById(req.session.userId)
        try {
            const allProjects = await projectRepository.findAll();
            const requestOptions = {
                method: "GET",
                redirect: "follow"
            };

            let url = `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_TOKEN}/latest/USD`;

            const exchangeRateResponse = await fetch(url, requestOptions)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .catch(error => {
                    console.error('There was a problem with your fetch operation:', error);
                });

            url = "http://www.boredapi.com/api/activity?type=education"
            const boredResponse = await fetch(url, requestOptions)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .catch(error => {
                    console.error('There was a problem with your fetch operation:', error);
                });

            res.render('en/index.ejs', {
                projects: allProjects,
                exchangeRate: exchangeRateResponse,
                boredApi: boredResponse,
                userEmail: email
            }); // Assuming EJS template named 'projects.ejs'
        } catch (error) {
            console.error(error);
            res.status(500).send('Error fetching projects');
        }
    }

    getProjectById = async (req, res) => {
        try {
            const project = await projectRepository.findById(req.params.id)
            res.render("en/project.ejs", {project})
        } catch (err) {
            res.status(500).send('Error fetching projects ' + err.message);
        }
    }

    projectCreationPage = async (req, res) => {
        try {
            res.render("en/create-project.ejs")
        } catch (err) {
            res.status(500).send("Error projectCreationPage GET: " + err.message)
        }
    }

    createProject = async (req, res) => {

        // // Use the path module to get the extension of the file

        upload(req, res, function (err) {
            const {title, description} = req.body
            const files = req.files;
            const fileNames = files.map(file => file.filename)
            const newProject = {title, description, img: fileNames}
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading.
                res.status(500).send({error: {message: `Multer uploading error: ${err.message}`}}).end();
            } else if (err) {
                // An unknown error occurred when uploading.
                if (err.name === 'ExtensionError') {
                    res.status(413).send({error: {message: err.message}}).end();
                } else {
                    res.status(500).send({error: {message: `unknown uploading error: ${err.message}`}}).end();
                }
            }
            projectRepository.createProject(newProject)
            res.redirect('/');
        })
    }

    projectUpdatePage = async (req, res) => {
        const oldProject = await projectRepository.findById(req.params.id)
        try {
            res.render("en/update-project.ejs", {project: oldProject})
        } catch (err) {
            res.status(500).send("Error projectCreationPage GET: " + err.message)
        }
    }

    updateProject = async (req, res) => {
        upload(req, res, function (err) {
            const id = req.params.id
            const {title, description} = req.body
            const files = req.files;
            const fileNames = files.map(file => file.filename)
            const updatedProject = {title, description, img: fileNames}

            if (err instanceof multer.MulterError) {
                res.status(500).send({error: {message: `Multer uploading error: ${err.message}`}}).end();
            } else if (err) {
                if (err.name === 'ExtensionError') {
                    res.status(413).send({error: {message: err.message}}).end();
                } else {
                    res.status(500).send({error: {message: `unknown uploading error: ${err.message}`}}).end();
                }
            }
            projectRepository.update(id, updatedProject)
            res.redirect('/');
        })
    }

    deleteProject = async (req, res) => {
        const id = req.params.id
        try {
            if (id) {
                await projectRepository.delete(id)
                res.redirect("/")
            } else {
                res.status(404).send("Project not found")
            }
        } catch (err) {
            console.error("DELETE METHOD: " + err)
        }

    }
}