import fastify from 'fastify';
import { UserRoutes } from './routes/userRoutes';
import { BookRoutes } from './routes/bookRoutes';

const app = fastify();

app.register(UserRoutes);
app.register(BookRoutes);

app.listen(
  {
    port: 3333,
  },
  (err) => {
    if (err) {
      return console.error(err);
    }
    console.log('Servidor rodando na porta http://localhost:3333');
  },
);
