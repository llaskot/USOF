import {pool} from "../sql/db.js";

/**
 * BEFORE ALL RUN:
 *    npm install mysql2
 */


function err_resp(message) {
    return {
        success: false,
        message: message
    }
}

export class Model {
    /**
     * Parent class and basic methods for db table models (CRUD)
     * @type {null}
     */

    static table = null;
    static attributes = [];
    static required_attributes = [];
    static updated_attributes = [];

    constructor(objAttrs = {}) {
        for (const key of Object.keys(objAttrs)) {
            this[key] = objAttrs[key];
        }
    }

    static async findById(id, attrs = null) {
        const required_columns = !attrs ? this.attributes.join(", ") : attrs.filter(f => this.attributes.includes(f)).join(", ");
        const [rows] = await pool.query(
            `SELECT ${required_columns}
             FROM ${this.table}
             WHERE id = ?`,
            [id]
        );
        if (rows.length === 0) return null;
        return new this(rows[0]);
    }

    static async findByUnique(field, val, attrs) {
        const required_columns = attrs.join(", ");
        const [rows] = await pool.query(
            `SELECT ${required_columns}
             FROM ${this.table}
             WHERE ${field} = ?`,
            [val]
        );
        if (rows.length === 0) return null;
        return new this(rows[0]);
    }

    static async findAll(attrs = null) {
        const required_columns = !attrs ? this.attributes.join(", ") : attrs.filter(f => this.attributes.includes(f)).join(", ");
        const [rows] = await pool.query(
            `SELECT ${required_columns}
             FROM ${this.table}`
        );
        // if (rows.length === 0) return null;
        const res = []
        for (let row of rows) {
            res.push(new this(row));
        }
        return res;
    }





    static async delete(id) {
        const [rows] = await pool.query(
            `DELETE
             FROM ${this.table}
             WHERE id = ?`,
            [id]
        );
        return {
            success: true,
            affectedRows: rows.affectedRows,
            info: rows.info,
        };
    }


    async create(connection = null) {
        const db_con = connection || pool;
        const dataFields = [];
        if (!this.constructor.required_attributes.every(attr => Object.keys(this).includes(attr))){
            return err_resp(`needs required attributes ${this.constructor.required_attributes}`);
        }

        for (const key of Object.keys(this)) {
            if (this.constructor.attributes.includes(key) && this[key] !== null && this[key] !== undefined) {
                dataFields.push(key);
            }
            else{
                delete this[key];
            }
        }
        const placeholders = dataFields.map(() => '?').join(', ');
        const values = dataFields.map(f => this[f]);
        const sql = `INSERT INTO ${this.constructor.table} (${dataFields.join(', ')})
                     VALUES (${placeholders})`;
        try {
            const [result] = await db_con.query(sql, values);
            this.id = result.insertId;
        } catch (err) {
            console.error(err);
            throw err;
        }
        return this;
    }

    async update(id, allowed_keys = null, connection = null) {
        allowed_keys = allowed_keys || this.constructor.updated_attributes;
        const db_con = connection || pool;
        const dataFields = [];
        const values = [];
        for (const key in this) {
            if (allowed_keys.includes(key) && this[key] !== null) {
                dataFields.push(`${key} = ?`);
                values.push(this[key]);
            }
        }
        if (dataFields.length === 0) return {
            success: false,
            result: `only values ${allowed_keys} can be updated.`,
        };
        values.push(id);
        const sql = `UPDATE ${this.constructor.table}
                     SET ${dataFields.join(', ')}
                     WHERE id = ?`;

        try {
            const [result] = await db_con.query(sql, values);
            return {
                success: true,
                changedRows: result.changedRows,
                result: result.info
            };
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    static async find(paramsObj){
        for (const key of Object.keys(paramsObj)) {
            if (!this.attributes.includes(key) || paramsObj[key] === undefined) {
                delete paramsObj[key];
            }
        }
        const keys = Object.keys(paramsObj);
        if (keys.length === 0) return {success: false, result: "need at least 1 appropriate key"};
        const values = Object.values(paramsObj);
        const where = keys.map(k => `${k} = ?`).join(" AND ");
        const sql = `SELECT * FROM ${this.table} WHERE ${where}`;
        const [rows] = await pool.query(sql, values);
        return rows;

    }

    static async del_by_params(paramsObj, connection = null) {
        const db_connection = connection || pool;
        for (const key of Object.keys(paramsObj)) {
            if (!this.attributes.includes(key) || paramsObj[key] === undefined) {
                delete paramsObj[key];
            }
        }
        const keys = Object.keys(paramsObj);
        if (keys.length === 0) return {success: false, result: "need at least 1 appropriate key"};
        const values = Object.values(paramsObj);
        const where = keys.map(k => `${k} = ?`).join(" AND ");
        const sql = `DELETE FROM ${this.table} WHERE ${where}`;
        await db_connection.query(sql, values);
    }

    static async countAll(){
        const sql = `SELECT COUNT(*) AS total FROM ${this.table}`;
        const [rows] = await pool.query(sql)
        console.log(rows[0].total);
        return rows[0].total;
    }

}


