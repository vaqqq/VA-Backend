const { model, Schema } = require('mongoose');

const companySchema  = new Schema({
    companyName: { type: String, required: true, unique: true },
    imageUrl: { type: String, required: true },
    adminUsername: { type: String, required: true },
    adminPassword: { type: String, required: true },
});

module.exports = model("Company", companySchema);