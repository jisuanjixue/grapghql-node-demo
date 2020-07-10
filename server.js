const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const mongoose = require("mongoose");

// var { buildSchema } = require("graphql");
const schema = require("./Schema/schema");

// Construct a schema, using GraphQL schema language
// var schema = buildSchema(`
//   type Query {
//     hello: String
//   }
// `);

// The root provides a resolver function for each API endpoint
// var root = {
//   hello: () => {
//     return "Hello world!";
//   }
// };

mongoose.connect("mongodb://127.0.0.1/graphql-node-demo", {
  useNewUrlParser: true,
  useUnifiedTopology: true 
});

mongoose.connection.once("open", function() {
  console.log("connected to database!");
});

const app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    // rootValue: root,
    graphiql: true
  })
);
app.listen(4000);
console.log("Running a GraphQL API server at http://localhost:4000/graphql");