import {Model} from "./model.js";
import {pool} from "../sql/db.js";
import {Like} from "./likeModel.js";
import {User} from "./userModel.js";



export class Comment extends Model {
    static table = "comments";
    static attributes = ["id","author","post_id","publish_date","content", "status"];
    static required_attributes = ["author", "post_id", "content"];

    static updated_attributes = ["content", "status"];


    constructor(objAttrs = {}) {
        super(objAttrs);
    }


    static async like(comment_id, author, comment_author, type) {
        /**
         * add like to the DB
         */
        let db_connection;
        try {
            db_connection = await pool.getConnection();
            await db_connection.beginTransaction();

            const like = new Like(
                {
                    author: author,
                    comment_id: comment_id,
                    type: !!type
                }
            )

            await like.create(db_connection);
            await User.rating_up_down(comment_author, type, db_connection)

            await db_connection.commit();
            // return {success: true};
        }catch (error) {
            console.error(error);
            if (db_connection) await db_connection.rollback();
            throw error;
        } finally {
            if (db_connection) db_connection.release();
        }
    }


    static async likeDelete(comment_id, author, comment_author, type) {
        /**
         * delete like from the DB
         */
        let db_connection;
        try {
            db_connection = await pool.getConnection();
            await db_connection.beginTransaction();

            await Like.del_by_params({author: author, comment_id: comment_id}, db_connection);
            await User.rating_up_down(comment_author, type, db_connection)

            await db_connection.commit();
        }catch (error) {
            console.error(error);
            if (db_connection) await db_connection.rollback();
            throw error;
        } finally {
            if (db_connection) db_connection.release();
        }
    }


}