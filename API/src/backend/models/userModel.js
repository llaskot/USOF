import {Model} from "./model.js";


export class User extends Model {
    static table = "users";
    static attributes = ["id", "role", "password", "login", "email", "full_name", "rating", "profile_picture"];
    static required_attributes = ["login", "email", "password"];
    static updated_attributes = ["full_name", "login", "role", "email", "password", "profile_picture"];


    constructor(objAttrs = {}) {
        super(objAttrs);
    }

    static async rating_up_down(user_id, rating, connection) {
        const change = rating ? 1 : -1;
        const sql = `UPDATE users SET rating = rating + ? WHERE id = ?`;
        return await connection.query(sql, [change, user_id]);
    }
}





