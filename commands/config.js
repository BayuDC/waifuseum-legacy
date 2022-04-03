const { MessageEmbed, Collection } = require('discord.js');
const Config = require('../models/config');
const User = require('../models/user');

const configCommands = new Collection();
['set', 'load', 'clear'].forEach(file => {
    const command = require(`./config/${file}.cjs`);
    configCommands.set(command.name, command);
});

module.exports = {
    name: 'config',
    /**
     * @param {import('discord.js').Message} message
     * @param {string} command
     * @param {Array} args
     */
    async execute(message, command, ...args) {
        const config = await Config.findOneOrCreate({
            serverId: message.guildId,
        });

        if (!command) {
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
        }

        if (!configCommands.has(command)) {
            return await message.channel.send({
                embeds: [
                    new MessageEmbed({
                        color: '0099ff',
                        title: 'All Configuration Commands',
                        fields: [
                            { name: 'config', value: 'Show all configuration values' },
                            ...[
                                configCommands.map(command => ({
                                    name: 'config ' + command.name,
                                    value: command.desc,
                                })),
                            ],
                        ],
                    }),
                ],
            });
        }

        if (!(await User.exists({ discordId: message.author.id, manageServer: true }))) {
            return await message.channel.send('Unauthorized');
        }

        await configCommands.get(command).execute(message, ...args);
    },
};
