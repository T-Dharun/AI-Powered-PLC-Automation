const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const connection = require('../database/db');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');

dotenv.config(); // Load environment variables

// Email sending function
const sendVerificationEmail = (email, token) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email provider
    auth: {
      user: "dharuneee007@gmail.com", // Your email address
      pass: "Dharun_2005", // Your email password or app-specific password
    },
  });

  const mailOptions = {
    from: "fasdf",
    to: email,
    subject: 'Email Verification',
    text: `Please verify your email by clicking on the link below:\n\nhttp://localhost:3000/verify-email/${token}`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error('Error sending email:', err);
    } else {
      console.log('Verification email sent:', info.response);
    }
  });
};

// Register route handler
const register = (req, res) => {
  const { username, email, password } = req.body;

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Error hashing password:', err);
      return res.status(500).send('Server error');
    }

    // Insert the user with access = false
    const query = 'INSERT INTO users (username, email, password, access) VALUES (?, ?, ?, ?)';
    
    connection.query(query, [username, email, hashedPassword, false], (err, results) => {
      if (err) {
        console.error('Error inserting data:', err);
        return res.status(500).send('Database error');
      }

      // Create a verification token
      const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Send verification email
      sendVerificationEmail(email, token);

      console.log('User registered:', results);
      res.status(200).send('User registered successfully. Please check your email to verify your account.');
    });
  });
};

// Email verification route
const verifyEmail = (req, res) => {
    const { token } = req.params;
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(400).send('Invalid or expired token');
      }
  
      const { email } = decoded;
  
      // Update user access to true
      const query = 'UPDATE users SET access = ? WHERE email = ?';
  
      connection.query(query, [true, email], (err, results) => {
        if (err) {
          console.error('Error updating access:', err);
          return res.status(500).send('Database error');
        }
  
        if (results.affectedRows === 0) {
          return res.status(404).send('User not found');
        }
  
        res.status(200).send('Email verified successfully. You can now log in.');
      });
    });
  };

  // Login route handler
const login = (req, res) => {
    const { email, password } = req.body;
  
    const query = 'SELECT * FROM users WHERE email = ?';
  
    connection.query(query, [email], (err, results) => {
      if (err) {
        console.error('Error fetching user:', err);
        return res.status(500).send('Database error');
      }
  
      if (results.length === 0) {
        return res.status(404).send('User not found');
      }
  
      const user = results[0];
  
      // Check if user is verified (access is true)
      if (!user.access) {
        return res.status(403).send('Your account is not verified. Please check your email to verify your account.');
      }
  
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          console.error('Error comparing password:', err);
          return res.status(500).send('Server error');
        }
  
        if (!isMatch) {
          return res.status(400).send('Incorrect password');
        }
  
        // Create JWT token
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
          expiresIn: '1h', // Token will expire in 1 hour
        });
  
        console.log('User logged in:', user);
        res.status(200).json({ message: 'Login successful', token });
      });
    });
  };
  
  module.exports={login,register};