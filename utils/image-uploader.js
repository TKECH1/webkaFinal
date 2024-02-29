import multer from "multer";
import * as path from "path";
import {fileURLToPath} from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url))


const storage = multer.diskStorage({
    destination: path.join(__dirname, '../public/uploads/'),
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + file.originalname.match(/\..*$/)[0]);
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            const err = new Error('Only .png, .jpg and .jpeg format allowed!')
            err.name = 'ExtensionError'
            return cb(err);
        }
    },
}).array('img', 4)
export default upload