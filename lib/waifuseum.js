const Picture = require('../models/picture');

class Waifuseum {
    constructor(name, channel) {
        this.name = name;
        this.channel = channel;
    }

    async create({ file, sauce }) {
        const message = await this.channel.send({ files: [file.path] });
        const picture = await Picture.create({
            url: message.attachments.first().url,
            messageId: message.id,
            category: this.name,
            sauce,
        });
        await message.edit({ content: picture.id });

        return {
            id: picture._id,
            url: picture.url,
            sauce: picture.sauce,
            category: picture.category,
        };
    }
}

module.exports = (name, channel) => {
    if (!name || !channel) return undefined;
    return new Waifuseum(name, channel);
};
