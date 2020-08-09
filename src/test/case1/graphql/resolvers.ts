const tasks = [
  { id: 1, name: 'Go to Market', complete: false },
  { id: 2, name: 'Walk the dog', complete: true },
  { id: 3, name: 'Take a nap', complete: false }
];

const resolvers = {
  Query: {
    tasks: () => tasks,
    task: (_, args) => tasks.find(o => o.id === args.id)
  }
};

export = resolvers;