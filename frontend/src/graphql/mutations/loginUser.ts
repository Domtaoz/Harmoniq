// src/graphql/mutations/loginUser.ts
import client from '@/lib/graphqlClient';

export const LOGIN_USER = `
  mutation LoginUser($username: String!, $password: String!) {
    loginUser(username: $username, password: $password) {
      success
      message
      user {
        id
        displayName
        username
        profilePictureUrl
      }
    }
  }
`;

type LoginResponse = {
  loginUser: {
    success: boolean;
    message: string;
    user: {
      id: number;
      displayName: string;
      username: string;
      profilePictureUrl: string;
    };
  };
};

export const loginUser = async (username: string, password: string) => {
  const res = await client.request<LoginResponse>(LOGIN_USER, { username, password });
  return res.loginUser;
};
