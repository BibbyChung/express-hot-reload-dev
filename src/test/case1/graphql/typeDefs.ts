const typeDefs = `
type Task {
  id: Int!
  name: String!
  complete: Boolean!
}
type Query {
  tasks: [Task]
  task(id: Int!): Task
}
`;

export = typeDefs;