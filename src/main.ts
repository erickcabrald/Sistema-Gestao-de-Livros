import fastify from 'fastify';

const app = fastify();

app.get('/user', (request, reply) => {
  return reply.send('Hello, Wold');
});

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
