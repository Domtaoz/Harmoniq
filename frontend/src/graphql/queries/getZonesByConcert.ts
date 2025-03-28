const GET_ZONES_BY_CONCERT = `
  query ($concertId: Int!) {
    getZonesByConcert(concertId: $concertId) {
      zoneId
      concertId
      zoneName
      price
    }
  }
`;

export default GET_ZONES_BY_CONCERT;
