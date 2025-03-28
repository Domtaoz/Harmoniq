import client from '@/lib/graphqlClient';

export const ADD_USER = `
  mutation AddUser($displayName: String!, $username: String!, $password: String!) {
    addUser(displayName: $displayName, username: $username, password: $password) {
      id
      displayName
      username
      profilePictureUrl
    }
  }
`;

type AddUserResponse = {
  addUser: {
    id: number;
    displayName: string;
    username: string;
    profilePictureUrl?: string;
    email?: string;
  };
};

export const addUser = async (
  displayName: string,
  username: string,
  password: string
) => {
  const res = await client.request<AddUserResponse>(ADD_USER, {
    displayName,
    username,
    password,
  });
  return res.addUser;
};
