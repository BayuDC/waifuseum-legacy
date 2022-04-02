const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'id',
    async execute(message) {
        const somethingThatHaveId = message.mentions.users.first() || message.mentions.roles.first() || message.mentions.channels.first();

        if (!somethingThatHaveId)
            return await message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('#0099ff')
                        .addFields(
                            { name: 'Server Id', value: `\`${message.guild.id}\`` },
                            { name: 'Channel Id', value: `\`${message.channel.id}\`` },
                            { name: 'Channel Parent Id', value: `\`${message.channel.parent?.id || '-'}\`` },
                            { name: 'Your User Id', value: `\`${message.author.id}\`` }
                        ),
                ],
            });

        await message.channel.send(`\`${somethingThatHaveId.id}\``);
    },
};
