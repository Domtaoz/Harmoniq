import client from '@/lib/graphqlClient';

const GET_CONCERTS = `
  query {
    getConcerts {
      concertId
      concertName
      bandName
      concertType
    }
  }
`;

type Concert = {
  concertId: number;
  concertName: string;
  bandName: string;
  concertType: string;
};

type GetConcertsResponse = {
  getConcerts: Concert[];
};

export const fetchConcerts = async (): Promise<Concert[]> => {
  const res = await client.request<GetConcertsResponse>(GET_CONCERTS);
  return res.getConcerts;
};
