import User from '../model/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import validator from 'validator';

export const signup = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all fields' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Email validation
    if (!validator.isEmail(normalizedEmail)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
    }

    // Password validation (Strong Password Rule)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
      });
    }

    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: role || 'user',
    });

    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };

    res.status(201).json({
      success: true,
      user: userData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const sendOtpEmail = async (userName, userEmail, otp) => {
  const serviceId = process.env.EMAILJS_SERVICE_ID || 'service_j185gcr';
  const templateId = process.env.EMAILJS_TEMPLATE_ID || 'template_bh6y4ah';
  const publicKey = process.env.EMAILJS_PUBLIC_KEY || '55GjyR5HxwazD17Dl';

  const payload = {
    service_id: serviceId,
    template_id: templateId,
    user_id: publicKey,
    template_params: {
      user_name: userName,
      to_email: userEmail,
      email: userEmail,
      user_email: userEmail,
      to: userEmail,
      otp: otp,
    },
  };

  if (process.env.EMAILJS_ACCESS_TOKEN) {
    payload.accessToken = process.env.EMAILJS_ACCESS_TOKEN;
  }

  const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`EmailJS send failed: ${response.status} - ${errorText}`);
  }

  return response;
};

export const login = async (req, res, next) => {
  try {
    const { email, password, otp } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Email validation
    if (!validator.isEmail(normalizedEmail)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
    }

    const user = await User.findOne({ email: normalizedEmail }).select('+password +otp +otpExpires').populate('cart.product');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // If OTP is not provided, generate, save and send it
    if (!otp) {
      const otpCode = Math.floor(1000 + Math.random() * 9000).toString();

      await User.updateOne(
        { _id: user._id },
        {
          otp: otpCode,
          otpExpires: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes validity
        }
      );

      try {
        await sendOtpEmail(user.name, user.email, otpCode);
      } catch (emailError) {
        console.error('Failed to send OTP email:', emailError);
        return res.status(500).json({
          success: false,
          message: 'Failed to send OTP verification email. Please try again.',
        });
      }

      return res.status(200).json({
        success: true,
        requiresOtp: true,
        message: 'OTP has been sent to your email address.',
      });
    }

    // If OTP is provided, verify it
    if (!user.otp || user.otp !== otp || !user.otpExpires || new Date() > user.otpExpires) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP. Please try again.',
      });
    }

    // Clear OTP fields upon successful verification
    await User.updateOne(
      { _id: user._id },
      {
        $set: { otp: null, otpExpires: null }
      }
    );

    const token = jwt.sign(
      { userId: user._id.toString(), role: user.role },
      process.env.SECRET_KEY || process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      cart: user.cart,
      createdAt: user.createdAt,
    };

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

    res.status(200).json({
      success: true,
      user: userData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res, next) => {
  try {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    };
    res.clearCookie('token', cookieOptions);
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.product');
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
