export const mockAvailableDatesReservation = [
  {
    date: '2024-07-15',
    concertId: 'concert-uuid-1',
    name: '락 페스티벌',
  },
  {
    date: '2024-07-16',
    concertId: 'concert-uuid-2',
    name: '락 페스티벌2',
  },
  {
    date: '2024-07-17',
    concertId: 'concert-uuid-3',
    name: '락 페스티벌3',
  },
];

export const mockSeatsReservation = {
  seats: [
    {
      id: 'seat-uuid-1',
      seatNumber: 1,
      price: 50000,
      status: 'AVAILABLE',
    },
    {
      id: 'seat-uuid-2',
      seatNumber: 2,
      price: 50000,
      status: 'RESERVED',
    },
  ],
  pagination: {
    currentPage: 1,
    totalPages: 10,
    totalItems: 500,
    itemsPerPage: 50,
  },
  concertInfo: {
    id: 'concert-uuid',
    name: '2024 여름 록 페스티벌',
    eventAt: '2024-07-15T19:00:00Z',
    totalSeatCount: 500,
    availableSeatCount: 300,
  },
};

export const mockReservationSeat = [
  {
    id: 'reservation-uuid',
    seatId: 'seat-uuid-1',
    status: 'PENDING',
    expiresAt: '2024-07-15T19:05:00Z',
  },
];
