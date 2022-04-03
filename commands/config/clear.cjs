const Config = require('../../models/config');

module.exports = {
    name: 'clear',
    desc: 'Remove all configuration values',
    async execute(message, config) {
        await Config.findByIdAndDelete(config._id);
        message.client.configs.delete(config.serverId);
        message.channel.send('Configuration removed');
    },
};
