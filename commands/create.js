const Category = require('../models/category');

module.exports = {
    name: 'create',
    async execute(message, name) {
        if (!name) return await message.channel.send("**I'm a teapot**");

        const category = await Category.findOne({ name });
        if (category) {
            return await message.channel.send(`Category **${name}** already exists`);
        }

        const channel = await message.guild.channels.create(name);
        await channel.setParent(message.channel.parent);

        await Category.create({ name, channelId: channel.id });
        message.client.waifuseum.set(name, channel);

        await message.channel.send(`Category **${name}** successfully created`);
    },
};
