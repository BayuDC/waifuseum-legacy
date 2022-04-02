const { Client, Collection, Intents } = require('discord.js');
const Category = require('../models/category');
const Config = require('../models/config');

const token = process.env.BOT_TOKEN;

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.waifuseum = new Collection();
client.configs = new Collection();
client.commands = new Collection();
['id', 'ping', 'create', 'delete', 'config'].forEach(file => {
    const command = require(`../commands/${file}`);
    client.commands.set(command.name, command);
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    const prefix = client.configs.get(message.guildId)?.prefix || '!';
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    if (!client.commands.has(command)) return;

    try {
        await client.commands.get(command).execute(message, ...args);
    } catch (error) {
        await message.channel.send('Something went wrong');
        console.log(error);
    }
});

client.once('ready', async () => {
    console.log('Bot is ready');
    (await Config.find()).forEach(config => {
        client.configs.set(config.serverId, config.toObject());
    });
    (await Category.find()).forEach(async category => {
        client.waifuseum.set(category.name, await client.channels.fetch(category.channelId));
    });
});

client.login(token);

module.exports = client.waifuseum;
