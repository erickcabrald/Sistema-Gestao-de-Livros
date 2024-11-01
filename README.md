# Sistema de Gestão de Livros

Este projeto é uma API de **sistema de gestão de livros** que permite aos usuários gerenciar um catálogo de livros de forma eficiente. O sistema oferece funcionalidades para adicionar, editar, remover e visualizar livros, além de permitir que os usuários deixem avaliações e resenhas.

## Objetivo

O principal objetivo deste projeto é criar uma API que facilite o gerenciamento de livros, proporcionando uma experiência amigável para os usuários. O sistema é ideal para bibliotecas, leitores e qualquer pessoa que queira manter um registro dos livros que possui ou deseja ler.

## Funcionalidades

- **Autenticação de Usuários**: Os usuários podem se registrar e fazer login no sistema para gerenciar suas informações.
- **Gerenciamento de Livros**: Funcionalidades de CRUD (Criar, Ler, Atualizar, Deletar) para livros.
- **Filtragem e Busca**: Possibilidade de buscar livros por gênero, autor ou classificações.
- **Avaliações e Resenhas**: Usuários podem deixar comentários e notas sobre os livros, ajudando outros leitores a escolherem suas próximas leituras.

## Tecnologias Utilizadas

- **Backend**:
  - [Fastify](https://www.fastify.io/) para criação da API.
- **Banco de Dados**:
  - [PostgreSQL no SuaBase](https://supabase.com/) para armazenar os dados dos livros e usuários.
- **Autenticação**:
  - [JWT (JSON Web Token)](https://jwt.io/) para gerenciar sessões de usuários e proteger rotas sensíveis.
- **Validação de dados**:
  - [Zod](https://zod.dev/) para validar os dados dos livros e usuários

### Modelo de Livro

- **Título**: O título do livro.
- **Autor**: O autor do livro.
- **Gênero**: O gênero do livro (ex: Ficção, Não-ficção).
- **Avaliação**: Nota dada ao livro por usuários.
- **Resenhas**: Comentários dos usuários sobre o livro.

### Modelo de Usuário

- **Nome de usuário**: Nome único do usuário.
- **Email do usuario**: Email único do usuario
- **Senha**: Senha para autenticação.
