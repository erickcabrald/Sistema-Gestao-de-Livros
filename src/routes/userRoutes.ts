import { FastifyInstance } from 'fastify';
import supabase from '../config/supabaseClient';
import { createToken } from 'src/utils/jwt';
import { z } from 'zod';

export function UserRoutes(app: FastifyInstance) {
  //Criação de Usuarios
  app.post('/user', async (request, reply) => {
    // Schema de validação zod
    const Schema = z.object({
      name: z.string().min(4, { message: 'Name is required' }),
      age: z.number().min(12, { message: 'Age must be at least 12' }),
      email: z.string().email({ message: 'Invalid email format' }),
      password: z.string().min(8, {
        message: 'Password must be at least 8 characters',
      }),
    });

    // Validando o request.body
    const result = Schema.safeParse(request.body);

    if (!result.success) {
      return reply.status(400).send({ error: result.error.format() });
    }

    const { name, age, email, password } = result.data;

    const { data, error } = await supabase.from('users').insert({
      name: result.data.name,
      email: result.data.email,
      password: result.data.password,
      age: result.data.age,
    });

    if (error) throw error;

    return reply
      .status(200)
      .send({ message: 'Usuario criado com sucesso', data });
  });

  app.post('/login', async (request, reply) => {
    // Schema de validação com Zod
    const Schema = z.object({
      email: z.string().email({ message: 'Formato de email inválido' }),
      password: z
        .string()
        .min(8, { message: 'Senha deve ter pelo menos 8 caracteres' }),
    });

    // Validando o request.body
    const result = Schema.safeParse(request.body);

    if (!result.success) {
      return reply.status(400).send({ error: result.error.format() });
    }

    const { email, password } = result.data;

    // Autenticação com Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      return reply.status(401).send({ error: 'Email ou senha inválidos' });
    }

    // Cria o token JWT
    const token = createToken(data.user.id); // Use o ID do usuário retornado pelo Supabase

    return reply.send({ token });
  });

  //Leitura de Usuarios
  app.get('/user', async (request, reply) => {
    const { data, error } = await supabase.from('users').select('*');

    if (error) throw error;
    return data;
  });
  //atualizando usuarios
  app.put('/user/:id', async (request, reply) => {
    const { id } = request.params as { id: any };

    const Schema = z.object({
      name: z.string().min(4, { message: 'Name is required' }).optional(),
      age: z
        .number()
        .min(12, { message: 'Age must be at least 12' })
        .optional(),
      password: z
        .string()
        .min(8, {
          message: 'Password must be at least 8 characters',
        })
        .optional(),
    });

    const result = Schema.safeParse(request.body);

    if (!result.success) {
      return reply.status(400).send({ error: result.error.format() });
    }

    const { name, age, password } = result.data;

    const { data, error } = await supabase
      .from('users')
      .update({
        name: result.data.name,
        age: result.data.age,
        password: result.data.password,
      })
      .match({ id });

    if (error) throw error;

    return reply
      .status(200)
      .send({ message: 'Usuario atualizado com sucesso', data });
  });

  app.delete('/user/:id', async (request, reply) => {
    const { id } = request.params as { id: any };

    const { data, error } = await supabase.from('users').delete().match({ id });

    if (error) {
      reply.status(404).send({ message: 'Usuario não encontrado' });
      throw error;
    }
    return reply
      .status(200)
      .send({ message: 'Usuario deletado com sucesso', data });
  });
}
