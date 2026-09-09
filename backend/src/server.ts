import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "./generated/prisma/client";
import "dotenv/config";

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

type Context = {
  prisma: PrismaClient;
};

const typeDefs = `#graphql
  type Todo {
    id: ID!
    title: String!
    completed: Boolean!
    createdAt: String!
  }

  type Query {
    getTodos: [Todo!]!
  }

  type Mutation {
    addTodo(title: String!): Todo!
    updateTodo(id: ID!, completed: Boolean!): Todo!
    deleteTodo(id: ID!): Todo!
  }
`;

const resolvers = {
  // DateTimeはISO文字列で保持する
  Todo: {
    createdAt: (parent: { createdAt: Date }) => parent.createdAt.toISOString(),
  },
  Query: {
    getTodos: (_: unknown, __: unknown, context: Context) =>
      context.prisma.todo.findMany({
        orderBy: { createdAt: "asc" },
      }),
  },
  Mutation: {
    addTodo: (
      _: unknown,
      { title }: { title: string },
      context: Context
    ) =>
      context.prisma.todo.create({
        data: { title, completed: false },
      }),

    updateTodo: (
      _: unknown,
      { id, completed }: { id: string; completed: boolean },
      context: Context
    ) =>
      context.prisma.todo.update({
        where: { id },
        data: { completed },
      }),

    deleteTodo: (_: unknown, { id }: { id: string }, context: Context) =>
      context.prisma.todo.delete({
        where: { id },
      }),
  },
};

const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,
});

// コンテナ外からアクセスできるようにするため0.0.0.0でlistenする
startStandaloneServer(server, {
  context: async () => ({ prisma }),
  listen: { port: 4000, host: "0.0.0.0" },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
