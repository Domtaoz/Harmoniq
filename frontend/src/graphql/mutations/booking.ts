import { gql } from "graphql-request";

export const CREATE_BOOKING = gql`
  mutation CreateBooking(
    $userId: Int!
    $concertId: Int!
    $zoneId: Int!
    $seatCount: Int!
    $seatIds: [Int!]!
  ) {
    createBooking(
      userId: $userId
      concertId: $concertId
      zoneId: $zoneId
      seatCount: $seatCount
      seatIds: $seatIds
    ) {
      bookingId
    }
  }
`;

export const UPDATE_BOOKING_STATUS = gql`
mutation UpdateBookingStatus($bookingId: Int!, $newStatus: String!) {
  updateBookingStatus(bookingId: $bookingId, newStatus: $newStatus) {
    bookingId
    status
  }
}
`;

export const CONFIRM_PAYMENT_AND_GENERATE_TICKETS = gql`
  mutation ConfirmPaymentAndGenerateTickets($bookingId: Int!) {
    confirmPaymentAndGenerateTickets(bookingId: $bookingId) {
      ticketId
      ticketCode
      concertName
      zoneName
      seatNumber
      showDate
      startTime
      endTime
    }
  }
`;
