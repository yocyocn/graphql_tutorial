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

  type Mutation {
    addTodo(title: String!): Todo!
    updateTodo(id: ID!, completed: Boolean!): Todo!
    deleteTodo(id: ID!): Todo!
  }
`;

const resolvers = {
  Query: {
    getTodos: () => todos
  },
  Mutation: {
    addTodo: (_: unknown, { title }: { title: string }) => {
      const newTodo = {
        id: String(todos.length + 1),
        title,
        completed: false,
      };
      todos.push(newTodo);
      return newTodo;
    },

    updateTodo: (
      _: unknown,
      { id, completed }: { id: string; completed: boolean }
    ) => {
      const todo = todos.find((todo) => todo.id === id);
      if (!todo) {
        throw new Error("Todo not found");
      }
      todo.completed = completed;
      return todo;
    },

    deleteTodo: (_: unknown, { id }: { id: string }) => {
      const index = todos.findIndex((todo) => todo.id === id);
      if (index === -1) {
        throw new Error("Todo not found");
      }
      const deletedTodo = todos.splice(index, 1);
      return deletedTodo[0];
    },

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
