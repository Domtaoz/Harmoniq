import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useNavigate } from 'react-router-dom';
import API_URL from '@/configURL/config';

interface UserStore {
  displayName: string;
  userId: string;
  profilePictureUrl: string;
  isLoggedIn: boolean;
  updateStore: (name: string, id: string, avatar: string) => void;
  logoutUser: () => void;
}

const STORAGE_KEY = 'userStore';

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      displayName: '',
      userId: '',
      profilePictureUrl: '',
      isLoggedIn: false,

      updateStore: (name, id, avatar) =>
        set({
          displayName: name,
          userId: id,
          profilePictureUrl: avatar,
          isLoggedIn: true,
        }),

      logoutUser: async () => {
        const { displayName, userId } = get();
        console.log(`Logging out: ${displayName} (${userId})`);

        try {
          const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query: `
                mutation {
                  logoutUser
                }
              `,
            }),
          });

          const result = await response.json();
          if (result.data?.logoutUser) {
            console.log('✅ Logged out');
            set({
              displayName: '',
              userId: '',
              profilePictureUrl: '',
              isLoggedIn: false,
            });
            localStorage.removeItem(`zustand-${STORAGE_KEY}`);
            window.location.href = '/login'; 
          } else {
            console.error('Logout failed', result.errors);
          }
        } catch (err) {
          console.error('Network error during logout', err);
        }
      },
    }),
    {
      name: STORAGE_KEY,
    }
  )
);
