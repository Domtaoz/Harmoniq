import { gql } from "graphql-request";

export const GET_BOOKING_BY_USER = gql`
  query GetBookingByUser($userId: Int!) {
    getBookingByUser(userId: $userId) {
      bookingId
      bookingStatus
      concertName
      zoneName
      seatNumber
      totalPrice
    }
  }
`;

export const GET_TICKETS_BY_USER = gql`
  query GetTicketsByUser($userId: Int!) {
    getTicketsByUser(userId: $userId) {
      ticketId
      ticketCode
      concertName
      zoneName
      seatNumber
    }
  }
`;
