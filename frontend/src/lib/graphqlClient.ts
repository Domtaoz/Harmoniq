// src/lib/graphqlClient.ts
import { GraphQLClient } from 'graphql-request';
import API_URL from '@/configURL/config';

const client = new GraphQLClient(API_URL, {
  headers: {
    'Content-Type': 'application/json',
  },
});

export default client;
