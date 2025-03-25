import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';

const profilePictures = [
  '/lovable-uploads/ccd731ff-84f5-49ef-92b3-92bca89068e.png',
  'https://api.dicebear.com/6.x/micah/svg?seed=Felix',
  'https://api.dicebear.com/6.x/micah/svg?seed=Zipper',
  'https://api.dicebear.com/6.x/micah/svg?seed=Misty',
  'https://api.dicebear.com/6.x/micah/svg?seed=Oscar',
  'https://api.dicebear.com/6.x/micah/svg?seed=Smokey',
  'https://api.dicebear.com/6.x/micah/svg?seed=Tiger',
  'https://api.dicebear.com/6.x/micah/svg?seed=Milo'
];

const Profile: React.FC = () => {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(profilePictures[0]);
  const [isFirstTimeSetup, setIsFirstTimeSetup] = useState(false);

  useEffect(() => {
    if (!state.auth.isAuthenticated) {
      navigate('/auth');
      return;
    }

    if (state.auth.isAuthenticated && !state.auth.user?.avatar) {
      setIsFirstTimeSetup(true);
    }

    if (state.auth.user?.name) {
      setName(state.auth.user.name);
    }

    setSelectedAvatar(state.auth.user?.avatar || profilePictures[0]);
  }, [state.auth.isAuthenticated, state.auth.user, navigate]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Name cannot be empty",
        variant: "destructive"
      });
      return;
    }

    const updatedUser = {
      ...state.auth.user,
      name,
      avatar: selectedAvatar
    };

    localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
    dispatch({ type: 'LOGIN', payload: updatedUser });
    toast({ title: 'Profile updated successfully!' });
    setIsFirstTimeSetup(false);
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="bg-white text-black dark:bg-brand-darkGray rounded-xl shadow-lg w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-amber-500">
          {isFirstTimeSetup ? 'Complete Your Profile' : 'Edit Profile'}
        </h2>

        <form onSubmit={handleSave}>
          <label className="block text-sm font-medium mb-1">Name</label>
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border rounded-full focus:outline-none"
            />
          </div>

          <label className="block text-sm font-medium mb-2">Profile Picture</label>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {profilePictures.map((url, index) => (
              <button
                key={index}
                onClick={() => setSelectedAvatar(url)}
                className={`rounded-full overflow-hidden focus:outline-none border-2 transition-transform ${
                  selectedAvatar === url ? 'border-pink-500 scale-105' : 'border-transparent'
                }`}
              >
                <img src={url} alt={`Avatar ${index}`} className="w-16 h-16 object-cover" />
              </button>
            ))}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-brand-pink text-white rounded-full font-medium transition-all hover:bg-opacity-90 hover:shadow-lg active:scale-95"
          >
            Save Changes
          </button>
        </form>

        {state.auth.user && (
          <div className="mt-8 bg-white dark:bg-brand-darkGray p-6 rounded-xl shadow-md space-y-2">
            <h3 className="text-lg font-semibold text-pink-500">Your Account Info</h3>
            <p><span className="font-medium">Name:</span> {state.auth.user.name}</p>
            <p><span className="font-medium">Email:</span> {state.auth.user.email}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
