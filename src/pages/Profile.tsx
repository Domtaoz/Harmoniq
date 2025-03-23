
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { motion } from 'framer-motion';
import { User, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

// Sample profile pictures
const profilePictures = [
  '/lovable-uploads/ccd731ff-8455-49ef-92b3-92b8ca80968e.png',
  'https://api.dicebear.com/6.x/micah/svg?seed=Felix',
  'https://api.dicebear.com/6.x/micah/svg?seed=Pepper',
  'https://api.dicebear.com/6.x/micah/svg?seed=Misty',
  'https://api.dicebear.com/6.x/micah/svg?seed=Oscar',
  'https://api.dicebear.com/6.x/micah/svg?seed=Smokey',
  'https://api.dicebear.com/6.x/micah/svg?seed=Tiger',
  'https://api.dicebear.com/6.x/micah/svg?seed=Milo'
];

const Profile: React.FC = () => {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [username, setUsername] = useState(state.auth.user?.username || '');
  const [selectedAvatar, setSelectedAvatar] = useState(state.auth.user?.avatar || profilePictures[0]);
  const [isFirstTimeSetup, setIsFirstTimeSetup] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    if (!state.auth.isAuthenticated) {
      navigate('/auth');
      return;
    }

    // Check if this is first time setup (no avatar yet)
    if (state.auth.isAuthenticated && !state.auth.user?.avatar) {
      setIsFirstTimeSetup(true);
    }
  }, [state.auth.isAuthenticated, state.auth.user, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      toast({
        title: "Error",
        description: "Username cannot be empty",
        variant: "destructive"
      });
      return;
    }

    // Update user in context
    if (state.auth.user) {
      const updatedUser = {
        ...state.auth.user,
        username,
        avatar: selectedAvatar
      };
      
      dispatch({ type: 'LOGIN', payload: updatedUser });
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
        variant: "default"
      });

      // If it was first time setup, redirect to home
      if (isFirstTimeSetup) {
        navigate('/');
      }
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center bg-brand-black">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden"
      >
        <div className="p-8">
          <h2 className="text-2xl font-bold text-center mb-6 text-amber-500">
            {isFirstTimeSetup ? 'Complete Your Profile' : 'Edit Profile'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Name</Label>
              <div className="relative">
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-full"
                  placeholder="Your name"
                />
                <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="block mb-2">Profile Picture</Label>
              <div className="grid grid-cols-4 gap-3">
                {profilePictures.map((pic, index) => (
                  <div 
                    key={index}
                    onClick={() => setSelectedAvatar(pic)}
                    className={`relative cursor-pointer rounded-lg overflow-hidden border-2 ${
                      selectedAvatar === pic ? 'border-pink-500' : 'border-transparent'
                    }`}
                  >
                    <Avatar className="w-full h-auto aspect-square">
                      <AvatarImage src={pic} alt={`Profile ${index + 1}`} />
                      <AvatarFallback>{index + 1}</AvatarFallback>
                    </Avatar>
                    {selectedAvatar === pic && (
                      <div className="absolute bottom-0 right-0 bg-pink-500 rounded-tl-lg p-0.5">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-pink-500 text-white rounded-full font-medium transition-all hover:bg-opacity-90 hover:shadow-lg active:scale-95"
            >
              {isFirstTimeSetup ? 'Confirm' : 'Save Changes'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
