
import { useEffect, useRef } from 'react';
import { Seat } from '@/types';

export const useIntersectionObserver = (
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit = {}
) => {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(callback, options);
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [callback, options]);

  return (element: Element | null) => {
    if (element && observerRef.current) {
      observerRef.current.observe(element);
      return () => {
        if (element && observerRef.current) {
          observerRef.current.unobserve(element);
        }
      };
    }
    return () => {};
  };
};

export const concertData = [
  {
    id: '1',
    name: 'BODYSLAM',
    date: '18 April 2013',
    image: '/concert_images/bodyslam.jpg',
    genre: 'Progressive Rock',
    artists: [
      {
        name: 'Toon Bodyslam',
        image: '/artists/toon-bodyslam.jpg'
      },

      {
        name: 'Pid Bodyslam',
        image: '/artists/Pid-bodyslam.jpg'
      },

      {
        name: 'Chad Bodyslam',
        image: '/artists/Chad-bodyslam.jpg'
      },

      {
       name: 'Pao Bodyslam',
       image: '/artists/Paobodyslam.jpg'
      }
    ]
  },
  {
    id: '2',
    name: 'THREE MAN DOWN',
    date: '19 August 2023',
    image: '/concert_images/mandownposter.jpg',
    genre: 'Pop Rock',
    artists: [
      {
        name: 'Krit Tree man down',
        image: '/artists/Krit-treemandown.jpg'
      },
      {
        name: 'Te Tree man down',
        image: '/artists/Te-treemandown.jpg'
      },
      {
        name: 'Toon Tree man down',
        image: '/artists/Toon-treemandown.jpg'
      },
      {
        name: 'Ohm Tree man down',
        image: '/artists/Ohm-treemandown.jpg'
      },
      {
        name: 'Seng Tree man down',
        image: '/artists/Seng-treemandown.jpg'
      }
    ]
  }
];

// Generate mock seat data
export const generateSeatData = (): Seat[] => {
  const rows = ['A', 'B', 'C', 'D', 'E'];
  const seatsPerRow = 15;
  const seats: Seat[] = [];

  const getPrice = (row: string): number => {
    if (row === 'A' || row === 'B') return 2000;
    if (row === 'C') return 1800;
    return 1600;
  };

  // Randomly mark some seats as unavailable
  const getRandomStatus = (): 'available' | 'unavailable' => {
    const random = Math.random();
    return random > 0.9 ? 'unavailable' : 'available';
  };

  for (const row of rows) {
    for (let i = 1; i <= seatsPerRow; i++) {
      seats.push({
        id: `${row}${i}`,
        row,
        number: i,
        price: getPrice(row),
        status: getRandomStatus()
      });
    }
  }

  return seats;
};
