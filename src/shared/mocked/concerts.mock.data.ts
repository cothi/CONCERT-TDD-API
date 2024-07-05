export const mockQueueEntryResponse = {
  userId: 'string',
  queuePosition: 20,
};

export const mockQueueResponse = {
  queueEntries: [
    {
      queueEntry: {
        id: 'queue-entry-uuid-1',
        userId: 'user-uuid',
        concertId: 'concert-uuid-1',
        position: 42,
        status: 'WAITING',
        enteredAt: '2024-07-15T10:30:00Z',
      },
      estimatedWaitTime: '15 minutes',
      concertInfo: {
        name: '2024 여름 록 페스티벌',
        eventDate: '2024-07-15T19:00:00Z',
        totalSeats: 5000,
        availableSeats: 3000,
      },
    },
    {
      queueEntry: {
        id: 'queue-entry-uuid-2',
        userId: 'user-uuid',
        concertId: 'concert-uuid-2',
        position: 1,
        status: 'READY',
        enteredAt: '2024-07-16T11:45:00Z',
      },
      estimatedWaitTime: '0 minutes',
      concertInfo: {
        name: '클래식 오케스트라 공연',
        eventDate: '2024-07-20T20:00:00Z',
        totalSeats: 2000,
        availableSeats: 500,
      },
    },
    {
      queueEntry: {
        id: 'queue-entry-uuid-3',
        userId: 'user-uuid',
        concertId: 'concert-uuid-3',
        position: null,
        status: 'EXPIRED',
        enteredAt: '2024-07-17T09:00:00Z',
      },
      estimatedWaitTime: null,
      concertInfo: {
        name: '재즈 페스티벌',
        eventDate: '2024-07-25T18:30:00Z',
        totalSeats: 3000,
        availableSeats: 1500,
      },
    },
  ],
};
