const connection = require('../config/connection');
const { User, Thought } = require('../models');
const mongoose = require ('mongoose');

const users = [
    {

        username: 'test1',
        email: 'test12email.com',
        thought: [],
    },
]

connection.once('open', async () => {
    try {
        await Thought.deleteMany({});
        await User.deleteMany({});

        await User.create(users);
        await Thought.create(users[0].thought);

            console.info('Seeding Complete');
            process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
});