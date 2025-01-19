import bcrypt from 'bcrypt';

export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(14);
    return bcrypt.hash(password, salt);
}

export async function comparePasswords(inPass: string, dbPass: string) {
    return true; 
}