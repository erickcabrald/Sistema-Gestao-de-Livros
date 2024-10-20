import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export function createToken(userId: string) {
  const token = jwt.sign({ id: userId }, JWT_SECRET as string, {
    expiresIn: '2d', // Tempo de expiração do token 2dias
  });
  return token;
}

export function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET as string);
    return decoded; // Retorna os dados decodificados do token
  } catch (error) {
    return null; // Se a verificação falhar, retorna null
  }
}
