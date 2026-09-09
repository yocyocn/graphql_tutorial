import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

const typeDefs = `#graphql
  type Query {
    message: String
  }
`;

const resolvers = {
  Query: {
    message: () => "Hello World!",
  },
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
