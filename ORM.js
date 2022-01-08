const query_exec = require('../DB');

class Orm {
	_placeholders = 0;

	constructor(table, timestamp = false) {
		this._table = table;
		this._timestamp = timestamp;
	}

	create(fields = {}) {
		if (this._timestamp) {
			fields.created_at = this.now();
			fields.updated_at = this.now();
		}
		const params = Object.keys(fields).join(', ');
		this._values = Object.values(fields);
		const placeholder = Object.keys(fields).map((data, key) => {
			this._placeholders++;
			return `$${this._placeholders}`;
		});
		this._sql = `INSERT INTO ${
			this._table
		}(${params}) VALUES (${placeholder.join(', ')})`;
		return this;
	}

	select(fields = []) {
		this._sql = `SELECT ${fields.join(', ')} FROM ${this._table}`;
		return this;
	}

	update(fields = {}) {
		if (this._timestamp) {
			fields.updated_at = this.now();
		}
		if (fields !== undefined) {
			const collect_fields = Object.keys(fields);
			this._values = Object.values(fields);
			if (collect_fields.length === 1) {
				this._placeholders++;
				this._whereClause = `${collect_fields} = $${this._placeholders}`;
			} else {
				let serialized_fields = [];
				collect_fields.map((field, key) => {
					const placeholder = key + 1;
					this._placeholders++;
					serialized_fields.push(`${field} = $${placeholder}`);
				});
				this._whereClause = `${serialized_fields.join(', ')}`;
			}
			this._sql = `UPDATE ${this._table} SET ${this._whereClause}`;
		}
		return this;
	}

	paginate(offset = 0, limit = 10) {
		this._paginate = `OFFSET ${offset} LIMIT ${limit}`;
		return this;
	}

	// don't use
	async deleted(fields = {}) {
		if (fields !== undefined) {
			const collect_fields = Object.keys(fields);
			this._values = Object.values(fields);
			if (collect_fields.length === 1) {
				this._placeholders++;
				this._whereClause = `${collect_fields} = $${this._placeholders}`;
			} else {
				let serialized_fields = [];
				collect_fields.map((field, key) => {
					this._placeholders++;
					serialized_fields.push(`${field} = $${this._placeholders}`);
				});
				this._whereClause = `${serialized_fields.join(' AND ')}`;
			}
			this._sql = `DELETE FROM ${this._table} WHERE ${this._whereClause} RETURNING id`;
		}
		// return this;
		return [this._sql, this._values];
	}

	where(fields, row) {
		if (fields !== undefined) {
			const collect_fields = Object.keys(fields);
			if (
				String(this._sql).includes('INSERT') ||
				String(this._sql).includes('UPDATE')
			) {
				this._values = [...this._values, ...Object.values(fields)];
			} else {
				this._values = Object.values(fields);
			}
			if (collect_fields.length === 1) {
				this._placeholders++;
				this._whereClause = `${collect_fields} = $${this._placeholders}`;
			} else {
				let serialized_fields = [];
				collect_fields.map((field, key) => {
					this._placeholders++;
					serialized_fields.push(`${field} = $${this._placeholders}`);
				});
				this._whereClause = `${serialized_fields.join(' AND ')}`;
			}
			// console.log(this._sql, 'Number');
			this._sql += ` WHERE ${this._whereClause} `;
		}
		return this;
	}

	async save() {
		const message = {};
		this._sql += ` RETURNING id;`;
		try {
			const result = await query_exec(this._sql, this._values);
			message.affected_rows = result.rowCount;
			if (this._sql.includes('INSERT')) {
				message.insertId = result.rows[0].id;
			} else {
				message.updateId = result.rows[0].id;
			}
			return message;
			// return [this._sql, this._values];
		} catch (err) {
			console.log(err, '-X-');
		}
		// // this._sql += ``;
		// const result = await pool.query(this._sql, this._values);
		// return [this._sql, this._values];
	}

	async saveGet(return_values = []) {
		this._sql += ` RETURNING id, ${return_values.join(', ')}`;
		try {
			const message = {};
			const result = await query_exec(this._sql, this._values);
			// return result.rows[0].id;
			message.affected_rows = result.rowCount;
			if (this._sql.includes('INSERT')) {
				message.insertId = result.rows[0].id;
			} else {
				message.updateId = result.rows[0].id;
			}
			message.fields = result.rows[0];
			return message;
		} catch (err) {
			// console.log(err.stack);
			console.log(err, '-X-');
		}
		// return this._sql;
	}

	async get(order = 'ASC') {
		try {
			if (this._sql === undefined) {
				this._sql = `SELECT * FROM ${this._table} ORDER BY id ${order} LIMIT 1;`;
			} else if (String(this._sql).includes('undefined WHERE')) {
				const where = String(this._sql).replace('undefined ', '');
				this._sql = `SELECT * FROM ${this._table} ${where}ORDER BY id ${order} LIMIT 1;`;
			} else {
				this._sql += ` ORDER BY id ${order} LIMIT 1;`;
			}
			const result = await query_exec(this._sql, this._values);
			// console.log(result, '--');
			return result.rows[0];
			console.log(this._sql, '--DEV--');
			// return [this._sql, this._values];
		} catch (error) {
			throw error;
		}

		// try {
		// 	// this._sql += ``;

		// 	return [this._sql, this._values];
		// } catch (error) {
		// 	console.log(error);
		// }
	}

	async gets(order = 'ASC') {
		// this._sql += ` ORDER BY id ${order}`;
		try {
			if (this._sql === undefined) {
				this._sql = `SELECT * FROM ${
					this._table
				} ORDER BY id ${order} ${
					this._paginate !== undefined ? this._paginate : ''
				};`;
			} else if (String(this._sql).includes('undefined WHERE')) {
				const where = String(this._sql).replace('undefined ', '');
				this._sql = `SELECT * FROM ${
					this._table
				} ${where}ORDER BY id ${order} ${
					this._paginate !== undefined ? this._paginate : ''
				};`;
			} else {
				this._sql += ` ORDER BY id ${order} ${
					this._paginate !== undefined ? this._paginate : ''
				};`;
			}
			// return [this._sql, this._values, this._paginate];
			const result = await query_exec(this._sql, this._values);
			return result.rows;
		} catch (error) {
			console.log(error);
		}
	}

	async delete() {
		try {
			if (String(this._sql).includes('undefined WHERE')) {
				const where = String(this._sql).replace('undefined ', '');
				this._sql = `DELETE FROM ${this._table} ${where}RETURNING id;`;
				const result = await query_exec(this._sql, this._values);
				return {
					affected_rows: result.rowCount,
					deleteId: result.rows[0].id,
				};
				// return [this._sql, this._values];
			}
		} catch (error) {
			console.log(error);
		}
	}

	// risky
	async clear() {
		this._sql = `DELETE FROM ${this._table}`;
		const result = await query_exec(this._sql);
		return result;
	}

	now() {
		const nz_date_string = new Date().toLocaleString('en-US', {
			timeZone: `Asia/Dhaka`,
		});
		// Date object initialized from the above datetime string
		const date_nz = new Date(nz_date_string);

		// year as (YYYY) format
		const year = date_nz.getFullYear();

		// month as (MM) format
		const month = ('0' + (date_nz.getMonth() + 1)).slice(-2);

		// date as (DD) format
		const day = ('0' + date_nz.getDate()).slice(-2);

		// hours as (HH) format
		const hours = ('0' + date_nz.getHours()).slice(-2);

		// minutes as (mm) format
		const minutes = ('0' + date_nz.getMinutes()).slice(-2);

		// seconds as (ss) format
		const seconds = ('0' + date_nz.getSeconds()).slice(-2);

		const date = `${year}-${month}-${day}`;

		// date and time as YYYY-MM-DD hh:mm:ss format
		const datetime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
		// return { date, datetime };
		return datetime;
	}
}
module.exports = Orm;
