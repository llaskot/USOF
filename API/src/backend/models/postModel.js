import {Model} from "./model.js";
import {pool} from "../sql/db.js";
import {User} from "./userModel.js";
import {Like} from "./likeModel.js";
import {format} from "date-fns"


export class Post extends Model {

    static table = "posts";
    static attributes = ["id", "author", "title", "publish_date", "status", "content"];
    static required_attributes = ["title", "content", "author"];
    static updated_attributes = ["title", "content", "status"];


    static async userActivities(user_id) {
        const sql = `SELECT COUNT(*) AS posts, (SELECT COUNT(*) FROM comments WHERE author = ?) AS comments
                     FROM posts
                     WHERE author = ?
                       AND status is TRUE`

        const [rows] = await pool.query(sql, [user_id, user_id]);
        return rows[0];
    }

    async #addCategories(categories, connection) {
        categories = [...new Set(categories)];
        const values = categories.map(id => [this.id, id]);
        await connection.query(
            'INSERT INTO post_category (post_id, category_id) VALUES ?',
            [values]
        );
    }

    async create_with_category() {
        let connection;
        try {
            const categories = this.categories;
            connection = await pool.getConnection()
            await connection.beginTransaction();
            await this.create(connection);
            await this.#addCategories(categories, connection);
            await connection.commit();
            return this;
        } catch (error) {
            console.error(error);
            if (connection) await connection.rollback();
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }


    static async post_categories(post_id) {
        const sql = `SELECT cat.id, cat.title, cat.description
                     FROM post_category pc
                              JOIN category cat ON cat.id = pc.category_id
                     WHERE pc.post_id = ?;`

        const [rows] = await pool.query(sql, [post_id]);
        return rows;
    }

    async #deleteCategories(post_id, connection) {
        await connection.query(
            'DELETE FROM post_category WHERE post_id = ?;',
            [post_id]
        );
    }

    async update_with_categories(post_id) {
        let db_connection;
        try {
            const categories = this.categories;
            db_connection = await pool.getConnection();
            await db_connection.beginTransaction();
            await this.#deleteCategories(post_id, db_connection);
            await this.#addCategories(categories, db_connection);
            const result = await this.update(post_id, null, db_connection);
            await db_connection.commit();
            return result;
        } catch (error) {
            console.error(error);
            if (db_connection) await db_connection.rollback();
            throw error;
        } finally {
            if (db_connection) db_connection.release();
        }

    }

    static async like(post_id, author, post_author, type) {
        let db_connection;
        try {
            db_connection = await pool.getConnection();
            await db_connection.beginTransaction();

            const like = new Like(
                {
                    author: author,
                    post_id: post_id,
                    type: !!type
                }
            )

            await like.create(db_connection);
            await User.rating_up_down(post_author, type, db_connection)

            await db_connection.commit();
            // return {success: true};
        } catch (error) {
            console.error(error);
            if (db_connection) await db_connection.rollback();
            throw error;
        } finally {
            if (db_connection) db_connection.release();
        }
    }

    static async likeDelete(post_id, author, post_author, type) {
        let db_connection;
        try {
            db_connection = await pool.getConnection();
            await db_connection.beginTransaction();

            await Like.del_by_params({author: author, post_id: post_id}, db_connection);
            await User.rating_up_down(post_author, type, db_connection)

            await db_connection.commit();
            // return {success: true};
        } catch (error) {
            console.error(error);
            if (db_connection) await db_connection.rollback();
            throw error;
        } finally {
            if (db_connection) db_connection.release();
        }
    }


    static set_date(date) {

        if (!date) {
            date = {}
        }
        if (!date.from) {
            date.from = '2020-09-14 19:23:45';
        }
        if (!date.to) {
            date.to = format(new Date(), "yyyy-MM-dd HH:mm:ss");
        }
        return date;
    }

    static set_order(sort) {
        const options = {
            likeASC: "COALESCE(lk.likes,0) ASC",
            likeDESC: "COALESCE(lk.likes,0) DESC",
            dateASC: "po.publish_date ASC",
            dateDESC: "po.publish_date DESC"
        }
        if (!sort || (sort[0] === null && sort[1] === null)) {
            return "lk.likes DESC, po.publish_date DESC"
        }
        const params = []
        if (Object.keys(options).includes(sort[0])) params.push(options[sort[0]]);
        if (Object.keys(options).includes(sort[1])) params.push(options[sort[1]]);
        return params.join(", ");
    }


    static async findByFilters(filters = null, sort = null, pagination = null) {
        /**
         * @param {filters} obj with filtered columns and values
         * @param {sort}
         * sort options
         * likeASC: "lk.likes ASC",
         * likeDESC: "lk.likes DESC",
         * dateASC: "po.publish_date ASC",
         * dateDESC: "po.publish_date DESC"
         *
         * @exsample
         * const a = await Post.findByFilters({date: {to: "2025-09-15 19:23:45"},
         *      category_id: [1,2], inactive: true, allCategory: true}, ['dateASC', 'likeASC']);
         */
        let where = `po.publish_date BETWEEN ? AND ? `
        if (!filters) filters = {};

        if (!filters.date || !filters.date.from || !filters.date.to) {
            filters.date = this.set_date(filters.date);
        }
        const params = [filters.date.from, filters.date.to]
        let having = "";
        if (filters.category_id && filters.category_id.length > 0) {
            params.push(filters.category_id);
            where = where + `AND pc.category_id in (?) `
            if (filters.allCategory) {
                having = 'HAVING COUNT(DISTINCT pc.category_id) = ?';
                params.push(filters.category_id.length)
            }
        }
        if (!filters.inactive || filters.inactive === false) {
            where = where + ` AND status IS TRUE `;
        }
        if (filters.my_own) {
            where = where + ` AND author = ${filters.my_own}`;
        }
        const sql = `SELECT po.id,
                            po.author AS author_id,
                            u.full_name AS author,
                            po.publish_date,
                            po.title,
                            po.content,
                            po.status,
                            GROUP_CONCAT(pc.category_id SEPARATOR ', ') AS categ_ids,
                            GROUP_CONCAT(cat.title SEPARATOR ', ')      AS categ_titles,
                            COALESCE(lk.reactions,0) AS reactions,
                            COALESCE(lk.likes,0) AS likes,
                            COALESCE(com_t.com, 0) AS com_qty
                     FROM posts po
                              JOIN post_category pc ON pc.post_id = po.id
                              LEFT JOIN (SELECT post_id AS id, COUNT(*) AS reactions, SUM(type) AS likes
                                    FROM likes
                                    WHERE post_id IS NOT NULL
                                    GROUP by post_id) AS lk ON po.id = lk.id
                              JOIN category cat ON cat.id = pc.category_id
                              JOIN users u ON u.id = po.author
                              LEFT JOIN (SELECT post_id, COUNT(*) AS com
                                    FROM comments
                                    GROUP BY post_id) AS com_t ON com_t.post_id = po.id
                     WHERE ${where}
                     GROUP BY po.id,
                              po.author,
                              po.publish_date,
                              po.title,
                              po.content,
                              po.status,
                              lk.reactions,
                              lk.likes,
                              com_t.com
                     ${having}
                     ORDER BY ${this.set_order(sort)}
                     ${this._setPagination(pagination)}
                    ;
        `
        const [rows] = await pool.query(sql, params);
        return rows;

    }

    static _setPagination(param){
        if (!param) return ``;
        return `LIMIT ${param.limit} OFFSET ${(param.page - 1) * param.limit}`;
    }

    static async search(phrase){
        const searchKeys = ['po.title', 'po.content', 'u.full_name', 'com.content', 'cat.description']
        const searchWords = phrase.trim().split(/\s+/);

        const res1 = []
        for (const key of searchKeys) {
            const row = []
            for (const word of searchWords) {
                row.push(` ${key} like '%${word}%' `)
            }
            res1.push(row.join(' AND '))
        }

        const where = ` WHERE (${res1.join(') OR (')})`
        const sql = `
            SELECT po.id,
                   po.author                                   AS author_id,
                   u.full_name                                 AS author,
                   po.publish_date,
                   po.title,
                   po.content,
                   po.status,
                   GROUP_CONCAT(pc.category_id SEPARATOR ', ') AS categ_ids,
                   GROUP_CONCAT(cat.title SEPARATOR ', ')      AS categ_titles,
                   COALESCE(lk.reactions, 0)                   AS reactions,
                   COALESCE(lk.likes, 0)                       AS likes,
                   COALESCE(com_t.com, 0)                      AS com_qty
            FROM posts po
                     JOIN post_category pc ON pc.post_id = po.id
                     LEFT JOIN (SELECT post_id AS id, COUNT(*) AS reactions, SUM(type) AS likes
                                FROM likes
                                WHERE post_id IS NOT NULL
                                GROUP by post_id) AS lk ON po.id = lk.id
                     JOIN category cat ON cat.id = pc.category_id
                     JOIN users u ON u.id = po.author
                     LEFT JOIN (SELECT post_id, COUNT(*) AS com
                                FROM comments
                                GROUP BY post_id) AS com_t ON com_t.post_id = po.id
                     LEFt JOIN comments com on com.post_id = po.id
            ${where}
            GROUP BY po.id,
                     po.author,
                     po.publish_date,
                     po.title,
                     po.content,
                     po.status,
                     lk.reactions,
                     lk.likes,
                     com_t.com
            ORDER BY po.publish_date DESC, COALESCE(lk.likes, 0) DESC;
        `
        const [rows] = await pool.query(sql);
        return rows;
    }
}



