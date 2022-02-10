const Category = require('../models/category');

module.exports = {
    name: 'delete',
    async execute(message, name) {
        if (!name) return await message.channel.send("**I'm a teapot**");

        const category = await Category.findOne({ name });
        const childCategories = await Category.find({ parent: name });

        if (!category) {
            return await message.channel.send(`Category **${name}** not found`);
        }
        if (childCategories.length > 0) {
            return message.channel.send(`Can't delete parent category`);
        }

        const channel = await message.client.channels.fetch(category.channelId);
        await channel.delete();

        await Category.deleteOne(category);
        message.client.waifuseum.delete(name);

        await message.channel.send(`Category **${name}** successfully deleted`);
    },
};
