import { FastifyInstance } from 'fastify';
import supabase from '../config/supabaseClient';

export function BookSearchRoutes(app: FastifyInstance) {
  app.get('/search', async (request, reply) => {
    const { author, genre, rating } = request.query as {
      author?: string;
      genre?: string;
      rating?: number;
    };

    // Inicializa a consulta
    let query = supabase.from('books').select('*');

    // Filtra por autor se fornecido
    if (author) {
      query = query.ilike('author', `%${author}%`); // Usando ilike para busca que não diferencia maiúsculas
    }

    // Filtra por gênero se fornecido
    if (genre) {
      query = query.ilike('genre', `%${genre}%`); // Usando ilike para busca que não diferencia maiúsculas
    }

    // Filtra por classificação se fornecida
    if (rating) {
      const { data: reviews, error: reviewError } = await supabase
        .from('book_reviews')
        .select('book_id')
        .eq('rating', rating); // Filtra avaliações com a classificação específica

      if (reviewError) {
        return reply.status(500).send({ error: 'Erro ao buscar avaliações' });
      }

      // Adiciona filtro aos livros
      const bookIds = reviews.map(review => review.book_id);
      query = query.in('id', bookIds); // Filtra livros com base nos IDs de avaliações
    }

    // Executa a consulta
    const { data, error } = await query;

    if (error) {
      return reply.status(500).send({ error: 'Erro ao buscar livros' });
    }

    return reply.send(data);
  });
}
