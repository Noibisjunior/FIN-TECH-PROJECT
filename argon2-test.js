const argon2 = require('argon2');

(async () => {
    try {
        const password = 'testpassword';
        
        // Hash the password
        const hash = await argon2.hash(password);
        console.log('Hashed password:', hash);

        // Verify the password
        const isMatch = await argon2.verify(hash, password);
        console.log('Password match:', isMatch);  // Should return true

        // Try with a wrong password
        const wrongPasswordMatch = await argon2.verify(hash, 'wrongpassword');
        console.log('Wrong password match:', wrongPasswordMatch);  // Should return false
    } catch (error) {
        console.error('Error:', error);
    }
})();
