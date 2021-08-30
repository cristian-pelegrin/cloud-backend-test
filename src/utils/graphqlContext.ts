import { DocumentClient } from 'aws-sdk/clients/dynamodb'

export interface Context {
  dbClient: DocumentClient
}