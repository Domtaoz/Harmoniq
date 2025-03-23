
import { Seat, Concert } from '@/types';
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
      price: "1500-3000",
      genre: "Pop",
      artists: [
        {
          name: "Bodyslam",
          image: "https://sv1.img.in.th/7Nifwp.jpeg"
        },
        {
          name: "Palmy",
          image: "https://your-link.com/palmy.jpg"
        }
      ]
    },
    {
      id: "2",
      title: "Bodyslam นั่งเล่น",
      date: "2013-04-18",
      venue: "National Stadium",
      image: "https://img5.pic.in.th/file/secure-sv1/bodyslam.jpg",
      description: "Experience Taylor Swift's record-breaking Eras Tour, spanning all of her musical eras and biggest hits.",
      price: "1500-3000",
      genre: "Pop",
      artists: [
        {
          name: "Bodyslam",
          image: "https://img5.pic.in.th/file/secure-sv1/bodyslam.jpg"
        },
        {
          name: "Palmy",
          image: "https://your-link.com/palmy.jpg"
        }
      ]
    }
  
  ];

  return concertData;
};

// Generate seat data for testing
export const generateSeatData = (): Seat[] => {
  const seats: Seat[] = [];
  
  // Generate seats for section A1, A2, A3 (Zone A)
  for (const section of ['A1', 'A2', 'A3']) {
    for (let row = 1; row <= 3; row++) {
      for (let num = 1; num <= 10; num++) {
        seats.push({
          id: uuidv4(),
          section: section,
          row: `Row ${row}`,
          number: num,
          price: 3000,
          status: Math.random() > 0.7 ? 'unavailable' : 'available',
        });
      }
    }
  }
  
  // Generate seats for section B1, B2, B3 (Zone B)
  for (const section of ['B1', 'B2', 'B3']) {
    for (let row = 1; row <= 3; row++) {
      for (let num = 1; num <= 10; num++) {
        seats.push({
          id: uuidv4(),
          section: section,
          row: `Row ${row}`,
          number: num,
          price: 1500,
          status: Math.random() > 0.7 ? 'unavailable' : 'available',
        });
      }
    }
  }
  
  // Generate seats for section C1, C2, C3 (Zone C)
  for (const section of ['C1', 'C2', 'C3']) {
    for (let row = 1; row <= 3; row++) {
      for (let num = 1; num <= 10; num++) {
        seats.push({
          id: uuidv4(),
          section: section,
          row: `Row ${row}`,
          number: num,
          price: 1000,
          status: Math.random() > 0.7 ? 'unavailable' : 'available',
        });
      }
    }
  }
  
  return seats;
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
