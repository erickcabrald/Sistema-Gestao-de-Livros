import { FastifyInstance } from 'fastify';
import supabase from '../config/supabaseClient';
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
}