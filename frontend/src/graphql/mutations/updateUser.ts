import client from '@/lib/graphqlClient';

const UPDATE_USER = `
  mutation UpdateUser($id: Int!, $displayName: String) {
    updateUser(id: $id, displayName: $displayName) {
      id
      displayName
    }
  }
`;

type Response = {
  updateUser: {
    id: number;
    displayName: string;
  };
};

export const updateUser = async (id: number, displayName: string) => {
  const res = await client.request<Response>(UPDATE_USER, { id, displayName });
  return res.updateUser;
};
