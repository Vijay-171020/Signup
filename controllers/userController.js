const sendMail = require('../utils/mailer');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res) => {
    try {
        const { name, email, age, dob, password } = req.body;

        if (!name || !email || !password || !age || !dob) {
            return res.status(400).json({ error: 'All fields are required' });
        }


        const existing = await User.findOne({ email });
        if (existing) {
            console.log('⚠️ Duplicate email attempted');
            return res.status(409).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            age,
            dob,
            password: hashedPassword
        });

        const saved = await user.save();

        await sendMail({
            to: user.email,
            subject: 'Welcome!',
            html: `<h2>Welcome, ${user.name}!</h2><p>Your account has been successfully created.</p>`
        });

        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: saved._id,
                name: saved.name,
                email: saved.email,
                age: saved.age,
                dob: saved.dob
            }
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            await sendMail({
                to: user.email,
                subject: 'Login Notification',
                html: `<p>Hello <strong>${user.name}</strong>,</p><p>You just logged in to your account.</p>`
            });
        }


        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user._id }, 'your_secret_key', { expiresIn: '1h' });

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                age: user.age,
                dob: user.dob
            }
        });

    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};


exports.getUsers = async (req, res) => {
    try {
        const { name, age, email, dob } = req.query;

        const filter = {};

        if (name) {
            filter.name = { $regex: name, $options: 'i' };
        }

        if (email) {
            filter.email = { $regex: email, $options: 'i' };
        }

        if (age) {
            filter.age = Number(age);
        }

        if (dob) {
            filter.dob = dob;
        }

        const users = await User.find(filter).select('-password');

        res.json(users);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: 'Invalid ID format' });
    }
};


exports.updateUser = async (req, res) => {
    try {
        const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};