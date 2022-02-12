const mongoose = require('mongoose');
const Category = require('./category');

const pictureSchema = new mongoose.Schema({
    url: String,
    sauce: String,
    category: String,
    messageId: {
        type: String,
        unique: true,
    },
});
pictureSchema.static('findRandom', async function (category, count) {
    const categories = [
        { category },
        ...(await Category.find(
            { parent: category },
            {
                _id: false,
                category: '$name',
            },
            { lean: true }
        )),
    ];

    const pictures = await this.aggregate()
        .match({ $or: categories })
        .sample(count || 1)
        .project({
            url: true,
            sauce: true,
            category: {
                $cond: {
                    if: { $ne: [category, '$category'] },
                    then: [category, '$category'],
                    else: '$category',
                },
            },
        });

    return pictures;
});
pictureSchema.static('createAndUpload', async function (channel, { pictureFile, sauce, category }) {
    const message = await channel.send({ files: [pictureFile.path] });
    const picture = await this.create({
        url: message.attachments.first().url,
        messageId: message.id,
        category,
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
});

pictureSchema.method('update', async function (pictureData) {
    return await mongoose.model('Picture').findByIdAndUpdate(this.id, pictureData, {
        new: true,
        projection: { url: true, sauce: true, category: true },
    });
});
pictureSchema.method('updateFile', async function (message, { pictureFile, sauce }) {
    await message.removeAttachments();
    await message.edit({ files: [pictureFile.path] });

    return await this.update({
        url: message.attachments.first().url,
        sauce,
    });
});
pictureSchema.method('updateCategory', async function (message, channel, { category, pictureFile, sauce }) {
    await message.delete();
    message = await channel.send({
        content: this.id,
        files: [pictureFile?.path ?? this.url],
    });

    return await this.update({
        url: message.attachments.first().url,
        sauce,
        category,
        messageId: message.id,
    });
});

module.exports = mongoose.model('Picture', pictureSchema);
