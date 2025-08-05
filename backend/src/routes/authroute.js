router.post('/register', async (req, res) => {
  console.log('🔍 Received register request:', req.body); // Add this

  try {
    const { name, email, password } = req.body;

    // Validate inputs
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    // Add your DB logic here...
    // e.g., check if user exists, hash password, save user

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('❌ Registration error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});
