const mongoose = require('mongoose');

const configSchema = new mongoose.Schema(
    {
        serverId: {
            type: String,
            unique: true,
        },
        prefix: String,
    },
    { versionKey: false }
);
configSchema.static('findOneOrCreate', async function (filter) {
    let config = await this.findOne(filter);

    if (!config) config = await this.create(filter);

    return config.toObject();
});

module.exports = mongoose.model('Config', configSchema);
