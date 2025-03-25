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

export const GET_TICKET_BY_USER = gql`
  query GetTicketByUser($userId: Int!) {
    getTicketByUser(userId: $userId) {
      ticketId
      concertName
      zoneName
      seatNumber
      ticketCode
      showDate
      startTime
      endTime
    }
  }
`;
