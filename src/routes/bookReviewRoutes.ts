import { FastifyInstance } from 'fastify';
import supabase from '../config/supabaseClient';
import { verifyToken } from '../utils/jwt';
import { z } from 'zod';

export function BookReviewRoutes(app: FastifyInstance) {
  // Adicionar uma nova avaliação
  app.post('/book/:bookId/review', { preHandler: verifyToken }, async (request, reply) => {
    const { userId } = request.user;
    const { bookId } = request.params as { bookId: string };

    const Schema = z.object({
      rating: z.number().min(1).max(5).int(),
      comment: z.string().optional(),
    });

    const result = Schema.safeParse(request.body);
    if (!result.success) {
      return reply.status(400).send({ error: result.error.format() });
    }


    const { data, error } = await supabase.from('book_reviews').insert({
      book_id: bookId,
      user_id: userId,
      rating: result.data.rating,
      comment: result.data.comment,
    });

    if (error) {
      return reply.status(500).send({ error: 'Erro ao salvar a avaliação' });
    }

    return reply.status(201).send({ message: 'Avaliação criada com sucesso', data });
  });

  // Obter todas as avaliações de um livro
  app.get('/book/:bookId/reviews', async (request, reply) => {
    const { bookId } = request.params as { bookId: string };

    const { data, error } = await supabase
      .from('book_reviews')
      .select('*')
      .eq('book_id', bookId);

    if (error) {
      return reply.status(500).send({ error: 'Erro ao buscar avaliações' });
    }

    return reply.status(200).send(data);
  });

  // Obter todas as avaliações feitas por um usuário
  app.get('/user/reviews', { preHandler: verifyToken }, async (request, reply) => {
    const { userId } = request.user;

    const { data, error } = await supabase
      .from('book_reviews')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      return reply.status(500).send({ error: 'Erro ao buscar avaliações do usuário' });
    }

    return reply.status(200).send(data);
  });

  // Atualizar uma avaliação
  app.put('/review/:id', { preHandler: verifyToken }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const { userId } = request.user;

    const Schema = z.object({
      rating: z.number().min(1).max(5).int().optional(),
      comment: z.string().optional(),
    });

    const result = Schema.safeParse(request.body);
    if (!result.success) {
      return reply.status(400).send({ error: result.error.format() });
    }

    const { rating, comment } = result.data;

    // Verifica se o usuário é o autor da avaliação
    const { data: existingReview, error: findError } = await supabase
      .from('book_reviews')
      .select('user_id')
      .eq('id', id)
      .single();

    if (findError || !existingReview || existingReview.user_id !== userId) {
      return reply.status(403).send({ error: 'Usuário não autorizado para atualizar essa avaliação' });
    }

    const { data, error } = await supabase
      .from('book_reviews')
      .update({ rating, comment })
      .match({ id });

    if (error) {
      return reply.status(500).send({ error: 'Erro ao atualizar a avaliação' });
    }

    return reply.status(200).send({ message: 'Avaliação atualizada com sucesso', data });
  });
}
