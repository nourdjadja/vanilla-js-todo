import { hash, compare } from 'bcrypt';

// Function to hash a password
export const hashPassword = async (password) => {
    const saltRounds = 10; // Number of salt rounds, a good default is 10
    try {
        // Generate the salt and hash the password
        const hashedPassword = await hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        console.error('Error hashing password:', error);
        throw new Error('Hashing failed');
    }
};

// Function to compare a plain text password with a hashed password
export const comparePassword = async (password, hashedPassword) => {
    try {
        // Compare the plain text password with the hashed password
        const match = await compare(password, hashedPassword);
        return match; // Returns true if passwords match, false otherwise
    } catch (error) {
        console.error('Error comparing password:', error);
        throw new Error('Comparison failed');
    }
};
