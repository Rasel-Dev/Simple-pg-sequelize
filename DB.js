const { Pool } = require('pg');

var config = {
	user: '', // env var: PGUSER
	database: '', // env var: PGDATABASE
	password: '', // env var: PGPASSWORD
	host: 'localhost', // Server hosting the postgres database
	port: , // env var: PGPORT
	max: 10, // max number of clients in the pool
	idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};

const pool = new Pool(config);

async function query_exec(sql, params) {
	const client = await pool.connect();
	let res;
	try {
		await client.query('BEGIN');
		try {
			res = await client.query(sql, params);
			await client.query('COMMIT');
		} catch (err) {
			// console.log(err, '--DEV--');
			await client.query('ROLLBACK');
			// throw err;
			// custom error handle
			const errmsg = String(err.message);
			// get first index with plus one
			const start = errmsg.indexOf('"') + 1;
			// get last index
			const end = errmsg.indexOf('"', start);
			// collect name from error message
			const collectField = errmsg.slice(start, end);
			// empty message object
			const message = {};

			if (errmsg.includes('not-null')) {
				// if null
				message[err.column] = `${err.column} field is required!`;
			} else if (errmsg.includes('duplicate key value')) {
				// if exists
				const fieldArr = collectField.split('_');
				fieldArr.splice(0, 1);
				fieldArr.splice(fieldArr.length - 1, 1);
				const field = fieldArr;
				message[field] = `${field} already exists!`;
			} else if (errmsg.includes('does not exist')) {
				// if fields not exists
				message[collectField] = `${collectField} field does not exist!`;
			}
			throw message;
		}
	} finally {
		client.release();
	}
	return res;
}

module.exports = query_exec;
