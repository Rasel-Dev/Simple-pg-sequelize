
# Simple Sql ORM

simple orm with zero knowledge requirement


## Quick Start

Initial

```javascript
const Orm = require('./ORM');
const User = new Orm('users', true);
```

### Example

Insert data
```javascript
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
Get multiple rows (with all fields)
```javascript
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
or (with selected field/fields)
```javascript
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
```javascript
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
```javascript
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

