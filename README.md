
# Simple Sql ORM

A brief description of what this project does and who it's for


## Quick Start

Initial

``` 
const Orm = require('./ORM');
const User = new Orm('users', true);
```

### Example

Insert data
```
async function submit() {
	try {
		const user = User.create({
			username: 'raseldev',
			password: '12345',
		});
        const result = await user.save();
		return result;
	} catch (err) {
		// errors goes here
	}
}
```
Get multiple rows
```
async function submit() {
	try {
		const user = User.select(['*']);
        const result = await user.gets();
		return result;
	} catch (err) {
		// errors goes here
	}
}
```
or
```
async function submit() {
	try {
		const user = User.select(['username', 'password']);
        const result = await user.gets();
		return result;
	} catch (err) {
		// errors goes here
	}
}
```

Get single row
```
async function submit() {
	try {
		const user = User.select(['*']);
        const result = await user.get();
		return result;
	} catch (err) {
		// errors goes here
	}
}
```
or
```
async function submit() {
	try {
		const user = User.select(['username', 'password']);
        const result = await user.get();
		return result;
	} catch (err) {
		// errors goes here
	}
}
```
## Authors

- [@Rasel-Dev](https://www.facebook.com/RaselDevGet/)

