// Frameworks e blibliotecas
import { FastifyInstance } from 'fastify';
import { date, z } from 'zod';
import dotenv from 'dotenv';
dotenv.config();
// importe de funções e outros
import supabase from '../config/supabaseClient';
import { verifyToken } from '../utils/jwt';

export function BookRoutes(app: FastifyInstance) {
  //Criação de livros
  app.post('/book', { preHandler: verifyToken }, async (request, reply) => {
    const { userId } = request.user;

    const Schema = z.object({
      title_book: z.string().min(1, { message: 'title is required' }),
      author_book: z.string().min(4, { message: 'author is required' }),
      publication_year: z.number().refine((year) => year <= new Date().getUTCFullYear(), {
      message: 'O ano de publicação não pode ser maior que o atual',})
    }); 

    const result = Schema.safeParse(request.body);
    if (!result.success) {
      return reply.status(400).send({ error: result.error.format() });
    }

    const { data, error } = await supabase.from('books').insert({
      title: result.data.title_book,
      author: result.data.author_book,
      publication_year: result.data.publication_year,
      user_id: userId,
    });

    if (error) {
      return reply.status(500).send({ error: 'Erro ao salvar o livro' });
    }

    return reply.status(201).send({ message: 'Livro criado com sucesso', data });
  });

  // Buscar todos books
  app.get('/book', async (request, reply) => {
    const { data, error } = await supabase.from('books').select('*');

    if (error) throw error;
    return data;
  });

  // Buscar Livros por usuarios
  app.get('/user/books',{ preHandler: verifyToken }, async (request, reply) => {

      const { userId } = request.user;

      const { data, error } = await supabase.from('books').select('*').eq('user_id', userId); 

      if (error) throw error;

      return data;
    },
  );

  // Put books
  app.put('/book/:id', { preHandler: verifyToken }, async (request, reply) => {

    const { id } = request.params as { id: any };

    const Schema = z.object({
      title_book: z.string().min(1, { message: 'title is required' }).optional(),
      author_book: z.string().min(4, { message: 'author is required' }).optional(),
      publication_year: z.number()
      .refine((year) => year <= new Date().getUTCFullYear(), {message: 'O ano de publicação não pode ser maior que o atual',
        }).optional(),
    });

    const result = Schema.safeParse(request.body);

    if (!result.success) {
      return reply.status(400).send({ error: result.error.format() });
    }

    const { data, error } = await supabase.from('books').update({
        title: result.data.title_book,
        author: result.data.author_book,
        publication_year: result.data.publication_year,
      }).match({ id });

    if (error) throw error;

    return reply.status(200).send({
      message: 'Livro atualizado com sucesso atualizado com sucesso', data,
    });
  });

  app.delete('/book/:id',{ preHandler: verifyToken }, async (request, reply) => {
      const { id } = request.params as { id: string };

      const { data, error } = await supabase.from('books').delete().match({ id });

      if (error) {
        reply.status(404).send({ message: 'Livro não encontrado' });
        throw error;
      }
      return reply
        .status(200)
        .send({ message: 'Livro deletado com sucesso', data });
    },
  );
}
