import {Model} from "./model.js";



export class Like extends Model {
    static table = "likes";
    static attributes = ["author", "post_id", "comment_id", "type"];
    static required_attributes = ["author", "type"];

    // static updated_attributes = ["full_name", "login", "role", "email", "password", "profile_picture"];


    constructor(objAttrs = {}) {
        super(objAttrs);
    }

}