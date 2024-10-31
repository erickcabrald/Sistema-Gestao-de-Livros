import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { FastifyRequest, FastifyReply } from 'fastify';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// Função para criar um token JWT para o usuário
export function createToken(userId: string) {
  const token = jwt.sign({ id: userId }, JWT_SECRET as string, {
    expiresIn: '2d', // Tempo de expiração do token: 2 dias
  });
  return token;
}

// Função middleware para verificar o token JWT
export async function verifyToken(
  request: FastifyRequest,
  reply: FastifyReply,
  done: Function, // Adiciona o callback `done`
) {
  const authHeader = request.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return reply.status(401).send({ error: 'Token não fornecido' });
  }

  try {
    // Verifica e decodifica o token
    const decoded = jwt.verify(token, JWT_SECRET as string);
    request.user = decoded; // Adiciona o usuário decodificado ao objeto request
    done(); // Permite que o fluxo continue após a verificação
  } catch (err) {
    return reply.status(403).send({ error: 'Token inválido' });
  }
}
