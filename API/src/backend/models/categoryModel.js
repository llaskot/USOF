import {Model} from "./model.js";
import {pool} from "../sql/db.js";
import {err_resp} from "../controllers/authController.js";


export class Category extends Model {
    static table = "category";
    static attributes = ["id", "title", "description",];
    static required_attributes = ["title"];
    static updated_attributes = ["title", "description",];


    constructor(objAttrs = {}) {
        super(objAttrs);
    }

    static async get_posts_by_categoryId(category_id) {
        /**
         *
         * @param {int} category id
         * @return {Object}
         */
        const sql = `SELECT po.*
                     FROM post_category pc
                              JOIN posts po ON po.id = pc.post_id
                     WHERE category_id = ?;`
        const [rows] = await pool.query(sql, [category_id]);
        if (!rows || rows.length === 0) {
            return err_resp("No posts found");
        }
        return {success: true, rows: rows};
    }
}