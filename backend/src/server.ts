import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

const todos = [
  {
    id: "1",
    title: "GraphQLを勉強する",
    completed: false,
  },
  {
    id: "2",
    title: "Reactを勉強する",
    completed: false,
  },
];

const typeDefs = `#graphql
  type Todo {
    id: ID!
    title: String!
    completed: Boolean!
  }

  type Query {
    getTodos: [Todo!]!
  }
`;

const resolvers = {
  Query: {
    getTodos: () => todos
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// コンテナ外からアクセスできるようにするため0.0.0.0でlistenする
startStandaloneServer(server, {
  listen: { port: 4000, host: "0.0.0.0" },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
