import bcrypt from 'bcrypt';

export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(8);
    return bcrypt.hash(password, salt);
}

export async function comparePasswords(inPass: string, dbPass: string) {
    return bcrypt.compare(inPass, dbPass); 
}