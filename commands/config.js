const { MessageEmbed } = require('discord.js');
const Config = require('../models/config');
const User = require('../models/user');

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
                            {
                                name: 'Admin Role',
                                value: config.adminRoleId ? `<@&${config.adminRoleId}> - \`${config.adminRoleId}\`` : 'not set',
                            },
                            {
                                name: 'Default Role',
                                value: config.defaultRoleId ? `<@&${config.defaultRoleId}> - \`${config.defaultRoleId}\`` : 'not set',
                            },
                            {
                                name: 'Museum Parent Channel',
                                value: config.museumParentId ? `<#${config.museumParentId}> - \`${config.museumParentId}\`` : 'not set',
                            },
                            {
                                name: 'Upload Gateway Channal',
                                value: config.uploadGatewayId ? `<#${config.uploadGatewayId}> - \`${config.uploadGatewayId}\`` : 'not set',
                            },
                        ],
                    }),
                ],
            });

        if (!(await User.exists({ discordId: message.author.id, manageServer: true }))) {
            return await message.channel.send('Unauthorized');
        }

        const configDoc = {};

        if (key == 'prefix') configDoc['prefix'] = value;
        if (key == 'admin-role') configDoc['adminRoleId'] = message.mentions.roles.first()?.id || value;
        if (key == 'default-role') configDoc['defaultRoleId'] = message.mentions.roles.first()?.id || value;
        if (key == 'museum-parent') configDoc['museumParentId'] = value;
        if (key == 'upload-gateway') configDoc['uploadGatewayId'] = message.mentions.channels.first()?.id || value;

        await Config.findByIdAndUpdate(config._id, configDoc);
        await message.channel.send('Configuration saved');
    },
};
