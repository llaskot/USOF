
import mysql from 'mysql2/promise';
import config from './config.json' with { type: 'json' };

/**
 * set db connection
 * @type {Pool}
 */
export const pool = mysql.createPool(config);