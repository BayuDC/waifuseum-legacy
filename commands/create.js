const Category = require('../models/category');

module.exports = {
    name: 'create',
    /**
     * @param {import('discord.js').Message} message
     * @param {string} name
     * @param {string} parentName
     */
    async execute(message, name, parentName) {
        if (!message.member.roles.cache.has(message.client.configs.get(message.guildId)?.adminRoleId))
            return await message.channel.send('Unauthorized');

        if (!name) return await message.channel.send('Category name is required');

        const category = await Category.findOne({ name });
        const parentCategory = await Category.findOne({ name: parentName });

        if (category) {
            return await message.channel.send(`Category **${name}** already exists`);
        }
        if (parentName) {
            if (!parentCategory) {
                return await message.channel.send(`Parent category **${parentName}** not found`);
            }
            if (parentCategory.parent) {
                return await message.channel.send(`Can't use category **${parentName}** as parent category`);
            }
        }

        const channel = await message.guild.channels.create(name);
        await channel.setParent(message.channel.parent);

        await Category.create({ name, channelId: channel.id, parent: parentName });
        message.client.waifuseum.set(name, channel);

        await message.channel.send(`Category **${name}** successfully created`);
    },
};
