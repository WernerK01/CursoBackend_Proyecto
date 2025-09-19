const fs = require('fs'),
    crypto = require('crypto');

class User {
    static #users = [];
    static #path = './src/data/users.json';

    static async getUsers() {
        try {
            if(fs.existsSync(this.#path)) {
                const data = await fs.promises.readFile(this.#path, 'utf-8');
                this.#users = JSON.parse(data) || [];
                return this.#users;
            } else { return []; }
        } catch(err) {
            console.log(`[ERROR]: Reading users data: ${err}`);
            throw new Error('Error reading users data');
        }
    }

    static async getUserById(id) {
        if(!this.#users.length == 0) this.#users = await this.getUsers();
        try {
            return this.#users.find(user => user.id === id) || null;
        } catch(err) {
            console.log(`[ERROR]: Getting user by ID: ${err}`);
            throw new Error('Error getting user by ID');
        }
    }

    static async addUser(user) {
        if(!this.#users.length == 0) this.#users = await this.getUsers();
        const exist = this.#users.find(u => u.mail == user.mail);
        if(exist) {
            console.log(`[LOG]: The user ${user.name} is already in the data.`);
            return;
        }

        let id = 1;
        if(this.#users.length > 0) {
            id = Math.max(...this.#users.map(i => i.id)) + 1;
        }
        user["id"] = id;
        user['password'] = crypto.createHmac('sha256', user.password).update(user.password).digest('hex');

        try {
            this.#users.push(user);
            await fs.promises.writeFile(this.#path, JSON.stringify(this.#users, null, 5), 'utf-8');
        } catch(err) {
            console.log(`[ERROR]: Writing users data: ${err}`);
            throw new Error('Error writing users data');
        }
    }

    static async remUser(id) {
        if(!this.#users.length == 0) this.#users = await this.getUsers();
        try {
            const user = this.getUserById(id);
            if(!user) return null;

            this.#users = this.#users.filter(i => i.id != id);
            await fs.promises.writeFile(this.#path, JSON.stringify(this.#users, null, 5), 'utf-8');

        } catch(err) {

        }
    }
}

module.exports = User;