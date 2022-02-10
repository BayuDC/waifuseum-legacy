const Picture = require('../models/picture');
const Category = require('../models/category');
const HttpError = require('./http-error');

const handleErr = err => {
    if (err.name == 'AbortError') err = new HttpError(504, 'Upload failed due to slow connection');
    if (err.name == 'DiscordAPIError' && err.message == 'Unknown Message') err = new HttpError(404, 'Picture not found');

    return err;
};

class Waifuseum {
    constructor(name, channel) {
        this.name = name;
        this.channel = channel;
    }
    async find(quantity) {
        const childCategories = await Category.find(
            { parent: this.name },
            {
                _id: false,
                category: '$name',
            },
            { lean: true }
        );
        const pictures = await Picture.aggregate()
            .match({ $or: [{ category: this.name }, ...childCategories] })
            .sample(quantity || 1)
            .project({
                url: true,
                sauce: true,
                category: {
                    $cond: {
                        if: { $ne: [this.name, '$category'] },
                        then: [this.name, '$category'],
                        else: '$category',
                    },
                },
            });

        if (!pictures.length) return;
        if (!quantity) return pictures[0];

        return pictures;
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
            return {
                picture: {
                    _id: picture._id,
                    url: picture.url,
                    sauce: picture.sauce,
                    category: picture.category,
                },
            };
        } catch (err) {
            return { err: handleErr(err) };
        } finally {
            file.destroy();
        }
    }
    async update(picture, { file, sauce, category }) {
        try {
            let message = await this.channel.messages.fetch(picture.messageId);
            let url;

            if (category) {
                const newMessage = await category.channel.send({
                    content: picture.id,
                    files: [file?.path ?? picture.url],
                });
                await message.delete();

                message = newMessage;
                url = message.attachments.first().url;
            } else if (file) {
                await message.removeAttachments();
                await message.edit({ files: [file.path] });

                url = message.attachments.first().url;
            }

            picture = await Picture.findByIdAndUpdate(
                picture.id,
                {
                    url,
                    sauce,
                    category: category?.name,
                    messageId: message.id,
                },
                {
                    new: true,
                    projection: { url: true, sauce: true, category: true },
                }
            );
            return { picture };
        } catch (err) {
            return { err: handleErr(err) };
        } finally {
            file?.destroy();
        }
    }
    async delete(picture) {
        try {
            const message = await this.channel.messages.fetch(picture.messageId);

            await message?.delete();
            await Picture.deleteOne(picture);
        } catch (err) {
            return handleErr(err);
        }
    }
}

module.exports = (name, channel) => {
    if (!name || !channel) return undefined;
    return new Waifuseum(name, channel);
};
