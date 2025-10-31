import {TokenController} from "./tokenController.js";
import {User} from "../models/userModel.js";
import {err_resp, saltRounds, validate, validEmail, validFullName, validLogin, validPass} from "./authController.js";
import bcrypt from "bcrypt";



import multer from 'multer';
import path from 'path';
import {fileURLToPath} from "url";
import * as fs from "node:fs";
import {Post} from "../models/postModel.js";


export class UserController {


    static async get_all_users(req, res) {
        const token = TokenController.checkAccess(req.headers);
        let fields;
        if (token.success && token.payload.role === "admin") {
            fields = ["id", "role", "login", "email", "full_name", "rating", "profile_picture"];
        } else {
            fields = ["id", "role", "full_name", "rating", "profile_picture"];
        }
        try {
            const users = await User.findAll(fields);
            return res.status(200).json({success: true, users: users});
        } catch (error) {
            console.error(error);
            return res.status(400).json(err_resp(error.message));
        }
    };


    static async user_by_id(req, res) {
        const user_id = parseInt(req.params.user_id);
        const token = TokenController.checkAccess(req.headers);
        let fields;
        let activityStatus = false;
        if (token.success && (token.payload.role === "admin" || token.payload.id === user_id)) {
            fields = ["id", "role", "login", "email", "full_name", "rating", "profile_picture"];
            activityStatus = true;
        } else {
            fields = ["id", "role", "full_name", "rating", "profile_picture"];
        }
        try {
            const user = await User.findById(user_id, fields);
            if (!user) {
                return res.status(404).json(err_resp("User not found"));
            }
            if (activityStatus) {
                user["activities"] = await Post.userActivities(user_id);
            }
            return res.status(200).json({success: true, user: user});
        } catch (error) {
            console.error(error);
            return res.status(400).json(err_resp(error.message));
        }

    };


    static async create_user(req, res) {
        const token = TokenController.checkAccess(req.headers);
        if (!token.success || !(token.payload.role === "admin")) {
            return res.status(403).json(err_resp("Access denied"));
        }
        const body = req.body;
        if (!(body.login && validate(body.login, validLogin))) {
            return res.status(400).json(err_resp('Invalid login. Use A-z, 0-9,  _-, 6-64 Symbols'));
        }
        if (!(body.email && validate(body["email"], validEmail))) {
            return res.status(400).json(err_resp('Invalid Email'));
        }

        if (body["full_name"] && !validate(body.password, validFullName)) {
            return res.status(400).json(err_resp('Invalid full name. Use letters, numbers, spaces,' +
                ' hyphens, or apostrophes. One or more words allowed. ' +
                'Name cannot consist of only digits or only symbols'));
        }

        if (!(body.password && validate(body.password, validPass))) {
            return res.status(400).json(err_resp('Invalid Password. 1-8 sym. Required at least 1 Upper,  1 lowercase 1 number.' +
                ' Allowed symbols ! @ # $ % ^ & * ( ) _ - + = < > ? { } [ ] ~ . , ; :'));
        }
        if (body["confirmation"] !== body.password) {
            return res.status(400).json(err_resp('confirmation error'));
        }

        body.password = await bcrypt.hash(body.password, saltRounds);
        let user = new User(body);
        try {
            user = await user.create();
            delete user["confirmation"]
            delete user["password"];
            return res.status(200).json({success: true, user: user});
        } catch (error) {
            console.error(error);
            return res.status(400).json(err_resp(error.message));
        }

    };


    static async update_user(req, res) {
        const user_id = parseInt(req.params.user_id)
        const token = TokenController.checkAccess(req.headers);
        let fields = null;
        if (token.success && token.payload.role === "admin") {
            fields = ["full_name", "login", "role", "email", "password",]
        } else if (token.success && token.payload.id === user_id) {
            fields = ["full_name", "login", "password",]
        } else {
            return res.status(403).json(err_resp('Access denied'));
        }

        const body = req.body;
        if (body.login && !(validate(body.login, validLogin))) {
            return res.status(400).json(err_resp('Invalid login. Use A-z, 0-9,  _-, 6-64 Symbols'));
        }
        if (body["email"] && !(validate(body["email"], validEmail))) {
            return res.status(400).json(err_resp('Invalid Email'));
        }

        if (body["full_name"] && !(validate(body["full_name"] , validFullName))) {
            return res.status(400).json(err_resp('Invalid full name. Use letters, numbers, spaces,' +
                ' hyphens, or apostrophes. One or more words allowed. ' +
                'Name cannot consist of only digits or only symbols'));
        }

        if (body["password"] && !(validate(body.password, validPass))) {
            return res.status(400).json(err_resp('Invalid Password. 1-8 sym. Required at least 1 Upper,  1 lowercase 1 number.' +
                ' Allowed symbols ! @ # $ % ^ & * ( ) _ - + = < > ? { } [ ] ~ . , ; :'));
        }
        if (body["password"]) {
            if (body["confirmation"] !== body.password)
                return res.status(400).json(err_resp('confirmation error'));
            else
                body.password = await bcrypt.hash(body.password, saltRounds);
        }

        const user = new User(body);
        try {
            const result = await user.update(user_id, fields);
            return res.status(200).json(result);
        } catch (error) {
            console.error(error);
            return res.status(400).json(err_resp(error.message));
        }
    }





    static __filename = fileURLToPath(import.meta.url);
    static __dirname = path.dirname(UserController.__filename);
    static uploadDir = path.join(UserController.__dirname, '../upload');

    static storage = multer.diskStorage({
        destination: this.uploadDir,
        filename: (req, file, cb) => {
            const uniqueName = req.id + "_ava" + path.extname(file.originalname);
            req["file_name"] = uniqueName;
            cb(null, uniqueName);
        }
    });


    static async  set_avatar(req, res) {

        const token = TokenController.checkAccess(req.headers);

        if (!token.success) {
            return res.status(403).json(err_resp('Access denied'));
        }
        req["id"] = token.payload.id

        const upload = multer({storage: UserController.storage})
        upload.single('file')(req, res, async (err) => {
            if (err) {
                return res.status(500).json({error: err.message});
            }
            if (!req.file) {
                return res.status(400).json({error: 'No file uploaded'});
            }
            const user = new User({"profile_picture": req.file_name});
            try {
                const result = await user.update(req.id);
                return res.json({success: true, filename: req.file_name, result: result});

            } catch (error) {
                console.error(error);
                return res.status(400).json(err_resp(error.message));
            }
        });


    }


    static async delete_user(req, res) {
        const user_id = parseInt(req.params.user_id)
        const token = TokenController.checkAccess(req.headers);
        if (token.success && (token.payload.role === "admin" || token.payload.id === user_id)) {
            try {
                const ava = await User.findById(user_id, ["profile_picture"]);
                const result = await User.delete(user_id);

                if (ava["profile_picture"]){
                    fs.unlink(path.join(UserController.uploadDir, ava["profile_picture"]), (err) => {
                        result["avatar_delete"] = !err;
                    });
                }
                res.status(200).json(result);
            } catch (error) {
                console.error(error);
                return res.status(400).json(err_resp(error.message));
            }
        }
        else
        {
            return res.status(403).json(err_resp('Access denied'));
        }
    }



}

