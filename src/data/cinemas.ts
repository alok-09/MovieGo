export interface Cinema {
  id: string;
  name: string;
  city: string;
  address: string;
  screens: number;
}

export const cinemas: Cinema[] = [
  {
    id: 'pvr-mumbai',
    name: 'PVR Phoenix',
    city: 'Mumbai',
    address: 'High Street Phoenix, Lower Parel',
    screens: 8,
  },
  {
    id: 'inox-delhi',
    name: 'INOX Nehru Place',
    city: 'Delhi',
    address: 'Nehru Place, South Delhi',
    screens: 6,
  },
  {
    id: 'cinepolis-bangalore',
    name: 'Cinepolis RCube',
    city: 'Bangalore',
    address: 'Rajaji Nagar, Bangalore',
    screens: 10,
  },
  {
    id: 'pvr-pune',
    name: 'PVR Pavilion',
    city: 'Pune',
    address: 'Shivaji Nagar, Pune',
    screens: 7,
  },
];

export const showtimes = ['11:00 AM', '2:00 PM', '6:30 PM', '9:45 PM'];
