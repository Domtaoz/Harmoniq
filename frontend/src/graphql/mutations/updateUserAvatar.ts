// src/graphql/mutations/updateUserAvatar.ts
import client from '@/lib/graphqlClient';

export const UPDATE_AVATAR = `
  mutation UpdateUserAvatar($id: Int!, $profilePictureUrl: String!) {
    updateUserAvatar(id: $id, profilePictureUrl: $profilePictureUrl) {
      id
      profilePictureUrl
    }
  }
`;

type UpdateAvatarResponse = {
  updateUserAvatar: {
    id: number;
    profilePictureUrl: string;
  };
};

export const updateAvatar = async (id: number, profilePictureUrl: string) => {
  const res = await client.request<UpdateAvatarResponse>(UPDATE_AVATAR, {
    id,
    profilePictureUrl,
  });

  return res.updateUserAvatar;
};
