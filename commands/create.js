const Category = require('../models/category');

module.exports = {
    name: 'create',
    async execute(message, name) {
        if (!name) return await message.channel.send("**I'm a teapot**");

        try {
            const channel = await message.guild.channels.create(name);
            await channel.setParent(message.channel.parent);

            await Category.create({ name, channelId: channel.id });

            await message.channel.send('Channel created!');
        } catch (err) {
            console.log(err);
        }
    },
};
