// drivefleet server - data/cars.js

const AVAILABLE_CARS = [
  {
    id: 1,
    name: 'BMW X5',
    price: 120,
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=400&q=80',
    transmission: 'Automatic',
    seats: '5 Seats',
    fuel: 'Petrol'
  },
  {
    id: 2,
    name: 'Toyota Camry',
    price: 80,
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=400&q=80',
    transmission: 'Automatic',
    seats: '5 Seats',
    fuel: 'Petrol'
  },
  {
    id: 3,
    name: 'Audi A4',
    price: 100,
    image: 'https://images.unsplash.com/photo-1606016159991-dfe4f974be5c?auto=format&fit=crop&w=400&q=80',
    transmission: 'Automatic',
    seats: '5 Seats',
    fuel: 'Petrol'
  },
  {
    id: 4,
    name: 'Mercedes C-Class',
    price: 110,
    image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=400&q=80',
    transmission: 'Automatic',
    seats: '5 Seats',
    fuel: 'Petrol'
  },
  {
    id: 5,
    name: 'Honda CR-V',
    price: 90,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=400&q=80',
    transmission: 'Automatic',
    seats: '5 Seats',
    fuel: 'Petrol'
  },
  {
    id: 6,
    name: 'Tesla Model 3',
    price: 150,
    image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=400&q=80',
    transmission: 'Automatic',
    seats: '5 Seats',
    fuel: 'Electric'
  }
];

// Export it so index.js can see it
module.exports = AVAILABLE_CARS;