const Category = require('../models/category');

module.exports = {
    name: 'delete',
    async execute(message, name) {
        if (!name) return await message.channel.send("**I'm a teapot**");

        const category = await Category.findOne({ name });
        if (!category) {
            return await message.channel.send(`Category **${name}** not found`);
        }

        const channel = await message.client.channels.fetch(category.channelId);
        await channel.delete();

        await Category.deleteOne(category);

        await message.channel.send(`Category **${name}** successfully deleted`);
    },
};
