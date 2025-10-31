import crypto from "crypto";
import bcrypt from "bcrypt";
import {User} from "../models/userModel.js";
import {Post} from "../models/postModel.js";
import {TokenController} from "./tokenController.js";
import {EmailModel} from "../models/emailModel.js";


const SECRET_KEY = Buffer.from("supersecretkey123456789012345665", "utf-8");
export const saltRounds = 5;

export const validLogin = /^(?! )(?!.* {2})[-A-Za-z0-9_ ]{6,64}(?<! )$/;
export const validEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
export const validPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z0-9!@#$%^&*()_\-+=<>?{}\[\]~.,;:]{8,16}$/;
export const validFullName = /^(?=.*[A-Za-zА-Яа-я\u00C0-\u017F])[A-Za-zА-Яа-я0-9\u00C0-\u017F]+(?:[ \-'][A-Za-zА-Яа-я0-9\u00C0-\u017F]+)*$/;


function encrypt(payload) {
    const iv = crypto.randomBytes(16); // вектор инициализации
    const cipher = crypto.createCipheriv("aes-256-gcm", SECRET_KEY, iv);
    const data = JSON.stringify(payload);
    let encrypted = cipher.update(data, "utf8", "base64");
    encrypted += cipher.final("base64");
    const tag = cipher.getAuthTag();
    return iv.toString("base64") + ":" + tag.toString("base64") + ":" + encrypted;
}

function decrypt(token) {
    const [ivB64, tagB64, encrypted] = token.split(":");
    const decipher = crypto.createDecipheriv("aes-256-gcm", SECRET_KEY, Buffer.from(ivB64, "base64"));
    decipher.setAuthTag(Buffer.from(tagB64, "base64"));

    let decrypted = decipher.update(encrypted, "base64", "utf8");
    decrypted += decipher.final("utf8");
    return JSON.parse(decrypted);
}

export function err_resp(message) {
    return {
        success: false,
        message: message
    }
}

export function success_resp(message) {
    return {
        success: true,
        message: message
    }
}

export function validate(val, regexp) {
    return typeof val === "string" && regexp.test(val);
}


export class AuthController {

    static async __sendMail(req, res, token, code, passwordChange = false) {
        res.cookie("registration_token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 10 * 60 * 1000
        });

        const email = new EmailModel(req.body["full_name"] ? req.body["full_name"] : req.body["login"],
            req.body["email"], code);
        try {
            if (passwordChange) {
                email.sendPassConfirm();
            } else email.sendEmailConfirm();
        } catch (error) {
            console.error(error);
        }

        // удалить после тестов
        if (!req.secure) {  // req.secure === true на HTTPS
            res.cookie("email_code", code, {
                httpOnly: false,
                secure: false,
                maxAge: 5 * 60 * 1000
            });
        }
        return res.status(200).json(success_resp('Code has been sent to email'));
    }


    static __checkCode(req) {

        if (!req.cookies["registration_token"]) {
            return err_resp('Confirm code spoiled');
        }
        const user_info = decrypt(req.cookies["registration_token"]);
        if (user_info.expires + 30 * 1000 < Date.now()) {
            return err_resp('Confirm code spoiled');
        }
        if (user_info.code !== req.body.code) {
            return err_resp('Confirm code incorrect');
        }
        return {
            success: true,
            user_info: user_info
        };
    }


    static async register(req, res) {
        const body = req.body;

        if (!(body.login && validate(body.login, validLogin))) {
            return res.status(400).json(err_resp('Invalid login. Use A-z, 0-9,  _-, 6-64 Symbols'));
        }
        if (!(body["email"] && validate(body["email"], validEmail))) {
            return res.status(400).json(err_resp('Invalid Email'));
        }
        if (!(body.password && validate(body.password, validPass))) {
            return res.status(400).json(err_resp('Invalid Password. 1-8 sym. Required at least 1 Upper,  1 lowercase 1 number.' +
                ' Allowed symbols ! @ # $ % ^ & * ( ) _ - + = < > ? { } [ ] ~ . , ; :'));
        }

        if (body["full_name"] && !validate(body.password, validFullName)) {
            return res.status(400).json(err_resp('Invalid full name. Use letters, numbers, spaces,' +
                ' hyphens, or apostrophes. One or more words allowed. ' +
                'Name cannot consist of only digits or only symbols'));
        }


        if (body["confirmation"] !== body.password) {
            return res.status(400).json(err_resp('confirmation error'));
        }
        delete body["confirmation"];
        if (body.role) {
            delete body.role;
        }
        body.code = Math.floor(100000 + Math.random() * 900000);
        body.expires = Date.now() + 10 * 60 * 1000
        const token = encrypt(body);
        return await AuthController.__sendMail(req, res, token, body.code)
    }


    static async reg_confirm(req, res) {

        const user_info = AuthController.__checkCode(req, res);
        if (!user_info.success) {
            return res.status(401).json(user_info);
        }
        const newUser = new User(user_info.user_info);
        newUser.password = await bcrypt.hash(newUser.password, saltRounds);
        try {
            await newUser.create();
        } catch (error) {
            return res.status(400).json(err_resp(error.message));
        }
        try {
            newUser["rating"] = 0;
            newUser["activities"] = await Post.userActivities(newUser.id);
        } catch (error) {
            return res.status(400).json(err_resp(error.message));
        }
        for (const key in newUser) {
            if (["expires", "code", "password"].includes(key)) {
                delete newUser[key];
            }
        }
        // return res.status(200).json(newUser);
        const payload = {
            id: newUser["id"],
            role: newUser["role"] || "user"
        };

        const tokens = TokenController.createTokens(payload);
        res.cookie("refresh_token", tokens.refresh, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            path: "/api/auth/refresh",
            maxAge: 2 * 60 * 60 * 1000
        });
        return res.status(200).json({success: true, user: newUser, token: tokens.access});
    }


    static async login(req, res) {

        if (!req.body.login || !req.body.password) {
            return res.status(400).json(err_resp('Invalid request body.'));
        }
        if (!validate(req.body.password, validPass)) {
            return res.status(401).json(err_resp('Invalid login or password'));
        }

        let searchField = null;
        if (validate(req.body.login, validEmail)) {
            searchField = "email";
        } else if (validate(req.body.login, validLogin)) {
            searchField = "login";
        } else {
            return res.status(401).json(err_resp('Invalid login or password2'));
        }
        let user = null;
        try {
            user = await User.findByUnique(searchField, req.body.login, ["id", "password", "login", "full_name", "email", "rating", "role", "profile_picture"])
        } catch (error) {
            console.error(error)
            return res.status(400).json(err_resp(error.message));
        }
        if (!user) {
            return res.status(401).json(err_resp('Invalid login or password'))
        }
        const verification = await bcrypt.compare(req.body.password, user["password"])
        if (!verification) {
            return res.status(401).json(err_resp('Invalid login or password'))
        } else {
            delete user["password"];
            try {
                user["activities"] = await Post.userActivities(user.id);
            } catch (error) {
                console.error(error)
                return res.status(400).json(err_resp(error.message));
            }
        }

        const payload = {
            id: user["id"],
            role: user["role"]
        };

        const tokens = TokenController.createTokens(payload);
        res.cookie("refresh_token", tokens.refresh, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            path: "/api/auth/refresh",
            maxAge: 2 * 60 * 60 * 1000
        });
        return res.status(200).json({success: true, user: user, token: tokens.access});
    };


    static async refresh(req, res) {
        const result = await TokenController.updateTokens(req.cookies);
        if (result.success) {
            res.cookie("refresh_token", result.tokens.refresh, {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
                path: "/api/auth/refresh",
                maxAge: 2 * 60 * 60 * 1000
            });
            return res.status(200).json({success: true, token: result.tokens.access});
        }
        return res.status(401).json(result);

    }


    static async logout(req, res) {
        res.clearCookie("refresh_token", {
            httpOnly: true,
            path: "/api/auth/refresh",
            sameSite: "strict"
        });

        return res.status(200).json({success: true, message: "Logged out"});
    }


    static async password_reset(req, res) {

        if (!(req.body["email"] && validate(req.body["email"], validEmail))) {
            return res.status(400).json(err_resp('Invalid Email'));
        }
        let userPromise = User.findByUnique("email", req.body["email"], ["id"],);
        const code = Math.floor(100000 + Math.random() * 900000);
        const expires = Date.now() + 10 * 60 * 1000
        const user_id = await userPromise;
        if (!user_id) {
            return res.status(404).json(err_resp('User not found'));
        }
        const token = encrypt({code: code, expires: expires, id: user_id.id});
        return await AuthController.__sendMail(req, res, token, code, true);
    }


    static async confirmReset(req, res) {
        const info = AuthController.__checkCode(req, res);
        if (!info.success) {
            return res.status(401).json(info);
        }
        const pass_hash = await bcrypt.hash(req.body.password, saltRounds);
        const user = new User({password: pass_hash});
        try {
            const result = await user.update(info.user_info.id);
            if (result.success) {
                return res.status(200).json(success_resp(result.result));
            } else {
                return res.status(400).json(err_resp(result.result));
            }
        } catch (error) {
            console.error(error);
            return res.status(400).json(err_resp(error.message));
        }

    }


    static async check_login(req, res) {
        if (!req.query.login)
            return res.status(401).json(err_resp('send parameter login'));
        if (req.query.login && !validate(req.query.login, validLogin))
            return res.status(401).json(err_resp('Invalid login. Use A-z, 0-9,  _-, 6-64 Symbols'));
        if (req.query.login && await User.findByUnique("login", req.query.login, ["id"]))
            return res.status(200).json(err_resp('User already exists'));
        return res.status(200).json(success_resp('ok'));
    }


    static async check_email(req, res) {
        if (!req.query["email"])
            return res.status(401).json(err_resp('send parameter email'));
        if (!validate(req.query["email"], validEmail))
            return res.status(401).json(err_resp('Invalid email.'));
        if (req.query["email"] && await User.findByUnique("email", req.query["email"], ["id"]))
            return res.status(200).json(err_resp('User already exists'));
        return res.status(200).json(success_resp('ok'));
    }


}

