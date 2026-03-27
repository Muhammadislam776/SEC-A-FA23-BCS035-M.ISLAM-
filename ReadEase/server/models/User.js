const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional for Google OAuth users
    googleId: { type: String },
    role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
    subscription: {
        plan: { type: String, default: 'FREE' },
        startDate: { type: Date },
        endDate: { type: Date },
        active: { type: Boolean, default: false }
    },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
    fines: { type: Number, default: 0 }
}, { timestamps: true });

userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function(password) {
    return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
