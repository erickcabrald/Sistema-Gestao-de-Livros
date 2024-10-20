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

import { FastifyRequest, FastifyReply } from 'fastify';

export function verifyToken(
  request: FastifyRequest,
  reply: FastifyReply,
  done: Function,
) {
  const authHeader = request.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return reply.status(401).send({ error: 'Token não fornecido' });
  }

  jwt.verify(token, JWT_SECRET as string, (err, decoded) => {
    if (err) {
      return reply.status(403).send({ error: 'Token inválido' });
    }

    // Adicione o usuário decodificado ao objeto request para uso em rotas
    request.user = decoded; // Isso permite que você acesse os dados do usuário nas rotas
    done(); // Chama a função 'done' para continuar o processamento da rota
  });
}
