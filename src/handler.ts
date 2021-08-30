import 'reflect-metadata';
import * as dotenv from 'dotenv'
import { Context, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ApolloServer } from 'apollo-server-lambda';
import * as TypeGraphQL from 'type-graphql';
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

dotenv.config();

import { resolvers } from './resolvers';

export async function helloWorld(event: APIGatewayProxyEvent, _context: Context): Promise<APIGatewayProxyResult> {
  const result: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'helloWorld',
      input: event
    })
  };

  return result;
}

export async function graphql(event: APIGatewayProxyEvent, context: Context): Promise<void | APIGatewayProxyResult> {
  // build TypeGraphQL executable schema
  (global as any).graphqlSchema = (global as any).graphqlSchema || TypeGraphQL.buildSchemaSync({
    resolvers: resolvers,
    validate: true,
  });
  const schema = (global as any).graphqlSchema as GraphQLSchema;

  const dbClient: DocumentClient = new DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000',
    accessKeyId: 'DEFAULT_ACCESS_KEY',  // needed if you don't have aws credentials at all in env
    secretAccessKey: 'DEFAULT_SECRET' // needed if you don't have aws credentials at all in env
  });

  const server = new ApolloServer({
    schema: TypeGraphQL.buildSchemaSync({
      resolvers: resolvers
    }),
    context: { dbClient },
    playground: {
      endpoint: '/local/graphql'
    },
    introspection: true
  });

  return server.createHandler()(event, context);
}
