const Picture = require('../models/picture');
const HttpError = require('./http-error');

const sanitize = picture => ({
    id: picture._id,
    url: picture.url,
    sauce: picture.sauce,
    category: picture.category,
});
const sanitizeErr = err => {
    if (err.name == 'AbortError') err = new HttpError(504, 'Upload failed due to slow connection');
    if (err.name == 'DiscordAPIError' && err.message == 'Unknown Message') err = new HttpError(404, 'Picture not found');

    return { err };
};

class Waifuseum {
    constructor(name, channel) {
        this.name = name;
        this.channel = channel;
    }

    async create({ file, sauce }) {
        try {
            const message = await this.channel.send({ files: [file.path] });
            const picture = await Picture.create({
                url: message.attachments.first().url,
                messageId: message.id,
                category: this.name,
                sauce,
            });
            await message.edit({ content: picture.id });

            return { picture: sanitize(picture) };
        } catch (err) {
            return { err: sanitizeErr(err) };
        } finally {
            file.destroy();
        }
    }
}

module.exports = (name, channel) => {
    if (!name || !channel) return undefined;
    return new Waifuseum(name, channel);
};
