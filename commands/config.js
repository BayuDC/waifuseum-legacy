const { MessageEmbed } = require('discord.js');
const Config = require('../models/config');

module.exports = {
    name: 'config',
    /**
     * @param {import('discord.js').Message} message
     * @param {string} key
     * @param {string} value
     */
    async execute(message, key, value) {
        const config = await Config.findOneOrCreate({
            serverId: message.guildId,
        });

        if (!key || !value)
            return await message.channel.send({
                embeds: [
                    new MessageEmbed({
                        color: '0099ff',
                        title: message.guild.name + "'s Configuration",
                        fields: [
                            { name: 'My Prefix', value: config.prefix || 'not set' },
                            { name: 'Admin Role', value: config.adminRoleId || 'not set' },
                            { name: 'Default Role', value: config.defaultRoleId || 'not set' },
                        ],
                    }),
                ],
            });

        const configDoc = {};

        if (key == 'prefix') configDoc['prefix'] = value;
        if (key == 'admin-role') configDoc['adminRoleId'] = message.mentions.roles.first()?.id || value;
        if (key == 'default-role') configDoc['defaultRoleId'] = message.mentions.roles.first()?.id || value;

        await Config.findByIdAndUpdate(config._id, configDoc);
        await message.channel.send('Configuration saved');
    },
};