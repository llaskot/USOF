import jwt from "jsonwebtoken";
import {User} from "../models/userModel.js";


export class TokenController {
    static TOKEN_KEY = "recordingInProgress";

    static createTokens(payload, key = this.TOKEN_KEY) {
        return {
            access: jwt.sign(payload, key, {expiresIn: "1m"}),
            refresh: jwt.sign(payload, key, {expiresIn: "7m"})
        }
    }

    static checkAccess(headers) {
        const authHeader = headers["authorization"];
        if (!authHeader) {
            return {success: false, message: "No token"};
        }
        const token = authHeader.split(" ")[1];
        try {
            const payload = jwt.verify(token, this.TOKEN_KEY);
            return {
                success: true,
                payload
            }
        } catch (err) {
            return {success: false, message: "Invalid or expired token"};
        }
    }

    static async updateTokens(cookies, key = this.TOKEN_KEY) {
        const refresh = cookies?.refresh_token;
        if (!refresh) {
            return {success: false, message: "No refresh token"};
        }
        try {
            const payload = jwt.verify(refresh, key);
            delete payload.iat;
            delete payload.exp;

            try {
                const user = await User.findById(payload.id);
                if (!user) {
                    return {
                        success: false,
                        tokens: "user is deleted"
                    }
                }
            } catch (error) {
                console.error(error);
                return {success: false, message: "Something went wrong with DB connection"};
            }

            return {
                success: true,
                tokens: this.createTokens(payload)
            }
        } catch (err) {
            console.error(err);
            return {success: false, message: "Invalid or expired refresh token"};
        }
    }
}