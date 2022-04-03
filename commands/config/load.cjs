module.exports = {
    name: 'load',
    desc: 'Load configuration values from database',
    async execute(message, config) {
        message.client.configs.set(config.serverId, config);
        message.channel.send('Configuration loaded');
    },
};
