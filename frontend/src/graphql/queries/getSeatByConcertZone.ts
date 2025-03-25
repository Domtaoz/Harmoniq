export const GET_SEATS_BY_CONCERT_ZONE = `
  query GetSeatsByConcertZone($concertId: Int!, $zoneName: String!) {
    getSeatsByConcertZone(concertId: $concertId, zoneName: $zoneName) {
      seatId
      seatNumber
      seatStatus
      concertId
      zoneName
    }
  }
`;
