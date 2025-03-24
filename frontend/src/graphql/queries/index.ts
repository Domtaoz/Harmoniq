export const GET_CONCERTS = `
  query {
    getConcerts {
      concertId
      concertName
      bandName
      concertType
    }
  }
`;

export const GET_CONCERT_BY_ID = `
  query GetConcertById($concertId: Int!) {
    getConcertById(concertId: $concertId) {
      concertId
      concertName
      bandName
      concertType
    }
  }
`;

export const GET_ZONES_BY_CONCERT = `
  query ($concertId: Int!) {
    getZonesByConcert(concertId: $concertId) {
      zoneId
      concertId
      zoneName
      price
    }
  }
`;

export const GET_SEATS_BY_CONCERT_ZONE = `
  query ($concertId: Int!, $zoneName: String!) {
    getSeatsByConcertZone(concertId: $concertId, zoneName: $zoneName) {
      seatId
      concertId
      zoneName
      seatNumber
      seatStatus
    }
  }
`;

export const GET_BOOKINGS_BY_USER = `
  query ($userId: Int!) {
    getBookingsByUser(userId: $userId) {
      bookingId
      userId
      concertName
      zoneName
      seatNumber
      seatCount
      totalPrice
      status
    }
  }
`;

export const GET_TICKETS_BY_USER = `
  query ($userId: Int!) {
    getTicketsByUser(userId: $userId) {
      ticketId
      bookingId
      userId
      concertName
      zoneName
      seatNumber
      ticketCode
    }
  }
`;
