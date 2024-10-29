import { FastifyInstance } from 'fastify';
import supabase from '../config/supabaseClient';
import { verifyToken } from '../utils/jwt';
import { date, z } from 'zod';
import dotenv from 'dotenv';
dotenv.config();

export function BookRoutes(app: FastifyInstance) {
  //Criação de livros
  app.post('/book', { preHandler: verifyToken }, async (request, reply) => {
    const token = process.env.TOKEN;

    const Schema = z.object({
      title_book: z.string().min(1, { message: 'title is required' }),
      author_book: z.string().min(4, { message: 'author is required' }),
      publication_year: z
        .number()
        .refine((year) => year <= new Date().getUTCFullYear(), {
          message: 'O ano de publicação não pode ser maior que o atual',
        }),
    });

    const result = Schema.safeParse(request.body);
    if (!result.success) {
      return reply.status(400).send({ error: result.error.format() });
    }

    const { title_book, author_book, publication_year } = result.data;
    const Userid = (request as any).user.id;

    const { data, error } = await supabase.from('books').insert({
      title: title_book,
      author: author_book,
      publication_year,
      user_id: Userid,
    });

    if (error) {
      return reply.status(500).send({ error: 'Erro ao salvar o livro' });
    }

    return reply
      .status(201)
      .send({ message: 'Livros criado com sucesso', data });
  });

  app.get('/book', async (request, reply) => {
    const { data, error } = await supabase.from('books').select('*');

    if (error) throw error;
    return data;
  });

  app.put('/book/:id', { preHandler: verifyToken }, async (request, reply) => {
    const { id } = request.params as { id: any };

    const Schema = z.object({
      title_book: z
        .string()
        .min(1, { message: 'title is required' })
        .optional(),
      author_book: z
        .string()
        .min(4, { message: 'author is required' })
        .optional(),
      publication_year: z
        .number()
        .refine((year) => year <= new Date().getUTCFullYear(), {
          message: 'O ano de publicação não pode ser maior que o atual',
        })
        .optional(),
    });

    const result = Schema.safeParse(request.body);

    if (!result.success) {
      return reply.status(400).send({ error: result.error.format() });
    }

    const { title_book, author_book, publication_year } = result.data;

    const { data, error } = await supabase
      .from('books')
      .update({
        title: result.data.title_book,
        author: result.data.author_book,
        publication_year: result.data.publication_year,
      })
      .match({ id });

    if (error) throw error;

    return reply
      .status(200)
      .send({
        message: 'Livro atualizado com sucesso atualizado com sucesso',
        data,
      });
  });
}
