import { ApolloServer } from 'apollo-server-express';
import exp from 'polka';
import { BaseRouter, exportAdapter } from './baseRouter';
import resolvers from '../graphql/resolvers';
import typeDefs from '../graphql/typeDefs';

const baseUrl = '/api/graphql';

class GraphqlController extends BaseRouter {

  constructor(
    protected app?: exp.Polka,
  ) {
    super(baseUrl, app);
  }

  init() {
    const server = new ApolloServer({ typeDefs, resolvers });

    server.applyMiddleware({
      app: this.router as any,
      path: baseUrl
    });
  }
}

export = exportAdapter(GraphqlController);  