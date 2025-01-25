const mongoose = require('mongoose');

const TimeEntrySchema = new mongoose.Schema({
    employee: { type: String, required: true },
    hours: { type: Number, required: true },
    description: { type: String },
    createdAt: { type: Date, default: Date.now },
});

const ProjectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    commissionNumber: { type: String, required: true },
    timeEntries: [TimeEntrySchema],
});

const CompanySchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    imageUrl: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    projects: [ProjectSchema],
    employees: [
        {
            name: { type: String, required: true },
            role: { type: String, default: 'employee' },
            createdAt: { type: Date, default: Date.now },
        },
    ],
});

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    companies: [CompanySchema],
});

module.exports = mongoose.model('User', UserSchema);
