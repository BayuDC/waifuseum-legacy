const { MessageEmbed } = require('discord.js');
const Config = require('../../models/config');

module.exports = {
    name: 'set',
    desc: 'Set a configuration value',
    async execute(message, config, key, value = '') {
        const configDoc = {};

        switch (key) {
            case 'prefix':
                value = value || '!';
                configDoc['prefix'] = value;
                break;
            case 'admin-role':
                value = message.mentions.roles.first()?.id || value;
                configDoc['adminRoleId'] = value;
                break;
            case 'default-role':
                value = message.mentions.roles.first()?.id || value;
                configDoc['defaultRoleId'] = value;
                break;
            case 'museum-parent':
                configDoc['museumParentId'] = value;
                break;
            case 'upload-gateway':
                value = message.mentions.channels.first()?.id || value;
                configDoc['uploadGatewayId'] = value;
                break;
            default:
                return await message.channel.send({
                    embeds: [
                        new MessageEmbed({
                            color: '0099ff',
                            title: 'All Available Configuration',
                            description: ['prefix', 'admin-role', 'default-role', 'museum-parent', 'upload-gateway'].reduce((sum, item) => {
                                return sum + `\`${item}\`\n`;
                            }, ''),
                        }),
                    ],
                });
        }

        config = await Config.findByIdAndUpdate(config._id, configDoc, { new: true });
        message.client.configs.set(config.serverId, config.toObject());

        if (!value) return message.channel.send(`Remove the \`${key}\` configuration`);
        message.channel.send(`Update the \`${key}\` to \`${value}\``);
    },
};
