
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
    image: '/lovable-uploads/babfe0b0-7f45-469e-b4d3-8ee9b3a4be23.png',
    genre: 'Progressive Rock'
  },
  {
    id: '2',
    name: 'THREE MAN DOWN',
    date: '19 August 2023',
    image: '/lovable-uploads/457bd668-9ceb-41aa-a74b-6948e092bd84.png',
    genre: 'Pop Rock'
  },
  {
    id: '3',
    name: 'BIG BANG',
    date: '29 October 2016',
    image: '/lovable-uploads/633b6fc2-7b4f-4ebf-9bec-c852c3ab7c98.png',
    genre: 'K-Pop'
  },
  {
    id: '4',
    name: 'TAITOSMITH',
    date: '19 June 2021',
    image: '/lovable-uploads/9254d24b-dff1-4994-a735-4e8a7f195339.png',
    genre: 'Rock'
  },
  {
    id: '5',
    name: 'BORN PINK',
    date: '15 July 2023',
    image: '/lovable-uploads/10493040-5059-40e2-b8f6-24af02e6c315.png',
    genre: 'K-Pop'
  },
  {
    id: '6',
    name: 'TILLYBIRDS',
    date: '01 July 2023',
    image: '/lovable-uploads/5ffd420c-40d4-430a-8ee9-c6a72193d5c9.png',
    genre: 'Indie Pop'
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
