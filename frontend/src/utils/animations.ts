
import { Concert } from '@/types';
import { v4 as uuidv4 } from 'uuid';


// Generate concerts with more interesting data for testing
export const generateConcerts = (): Concert[] => {
  const concertData = [
    {
      id: "1",
      title: "Bodyslam นั่งเล่น",
      date: "2013-04-18",
      venue: "National Stadium",
      image: "https://img5.pic.in.th/file/secure-sv1/bodyslam.jpg",
      description: "Experience Taylor Swift's record-breaking Eras Tour, spanning all of her musical eras and biggest hits.",
      price: "1000-3000",
      genre: "Pop",
      artists: [
        {
          name: "Toon Bodyslam",
          image: "https://sv1.img.in.th/7Nifwp.jpeg"
        },
        {
          name: "Pao Bodyslam",
          image: "https://img2.pic.in.th/pic/Paobodyslam.jpg"
        },
        {
          name: "Chad Bodyslam",
          image: "https://img2.pic.in.th/pic/Chad-bodyslam.jpg"
        },
        {
          name: "Pid Bodyslam",
          image: "https://img5.pic.in.th/file/secure-sv1/Pid-bodyslam.jpg"
        }
      ]
    },
    {
      id: "3",
      title: "Cocktail",
      date: "2025-03-30",
      venue: "National Stadium",
      image: "https://img5.pic.in.th/file/secure-sv1/cooktail99dea2a8325a9119.jpg",
      description: "Experience Taylor Swift's record-breaking Eras Tour, spanning all of her musical eras and biggest hits.",
      price: "1000-3000",
      genre: "Pop",
      artists: [
        {
          name: "Ohm Cocktail",
          image: "https://img2.pic.in.th/pic/OhmCocktail.jpg"
        },
        {
          name: "Chao Cocktail",
          image: "https://img2.pic.in.th/pic/ChaoCocktail.jpg"
        },
        {
          name: "Park Cocktail",
          image: "https://img5.pic.in.th/file/secure-sv1/ParkCocktail.jpg"
        },
        {
          name: "Philip Cocktail",
          image: "https://img5.pic.in.th/file/secure-sv1/PhilipCocktail.jpg"
        },
        {
          name: "Neng Cocktail",
          image: "https://img2.pic.in.th/pic/NengCocktail.jpg"
        },
        {
          name: "X Cocktail",
          image: "https://img2.pic.in.th/pic/XCocktail.jpg"
        }
      ]
    },
    {
      id: "2",
      title: "Three man down",
      date: "2023-08-19",
      venue: "National Stadium",
      image: "https://img2.pic.in.th/pic/mandownposterf20ae55d573a9cf4.jpg",
      description: "Experience Taylor Swift's record-breaking Eras Tour, spanning all of her musical eras and biggest hits.",
      price: "1000-3000",
      genre: "Pop",
      artists: [
        {
          name: "Krit Three man down",
          image: "https://img2.pic.in.th/pic/Krit-treemandown.jpg"
        },
        {
          name: "Te Three man down",
          image: "https://img2.pic.in.th/pic/Te-treemandown.jpg"
        },
        {
          name: "Toon Three man down",
          image: "https://img5.pic.in.th/file/secure-sv1/Toon-treemandown.jpg"
        },
        {
          name: "Ohm Three man down",
          image: "https://img2.pic.in.th/pic/Ohm-treemandown.jpg"
        },
        {
          name: "Seng Three man down",
          image: "https://img2.pic.in.th/pic/Seng-treemandown810a09dbe3cff3ed.jpg"
        }
      ]
    },
      {
      id: "4",
      title: "Blackpink",
      date: "2023-05-27",
      venue: "National Stadium",
      image: "https://img2.pic.in.th/pic/blackpink.png",
      description: "Experience Taylor Swift's record-breaking Eras Tour, spanning all of her musical eras and biggest hits.",
      price: "1000-3000",
      genre: "K-Pop",
      artists: [
        {
          name: "Lisa Blackpink",
          image: "https://img2.pic.in.th/pic/LisaBlackpink.jpg"
        },
        {
          name: "Rose Blackpink",
          image: "https://img5.pic.in.th/file/secure-sv1/RoseBlackpink.jpg"
        },
        {
          name: "Jannie Blackpink",
          image: "https://img5.pic.in.th/file/secure-sv1/JennieBlackpink.jpg"
        },
        {
          name: "Jiso Blackpink",
          image: "https://img2.pic.in.th/pic/JisoBlackpink.jpg"
        }
      ]
    }

  ];
  
  

  return concertData;
};

// Export concertData for use in components
export const concertData: Concert[] = generateConcerts();

// Animation variants for framer-motion
export const fadeIn = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};
