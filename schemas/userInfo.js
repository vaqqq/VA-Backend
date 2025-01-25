const { model, Schema } = require('mongoose');

const badgeSchema = new Schema({
    badgeName: { type: String, required: true },
    badgeUrl: { type: String, required: true },
    dateApproved: { type: Date, required: true }
});

const userBadgeSchema = new Schema({
    username: { type: String, required: true },
    badges: [badgeSchema] 
});

module.exports = model("UserBadges", userBadgeSchema);