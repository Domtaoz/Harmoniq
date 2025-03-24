export const LOGIN_USER = `
  mutation LoginUser($username: String!, $password: String!) {
    loginUser(username: $username, password: $password) {
      success
      message
      user {
        id
        displayName
        username
        profilePictureUrl
      }
    }
  }
`;

export const ADD_USER = `
  mutation AddUser($displayName: String!, $username: String!, $password: String!) {
    addUser(displayName: $displayName, username: $username, password: $password) {
      id
      displayName
      username
    }
  }
`;

export const UPDATE_USER = `
  mutation UpdateUser($id: Int!, $displayName: String) {
    updateUser(id: $id, displayName: $displayName) {
      id
      displayName
      username
    }
  }
`;

export const UPDATE_AVATAR = `
  mutation UpdateUserAvatar($id: Int!, $profilePictureUrl: String!) {
    updateUserAvatar(id: $id, profilePictureUrl: $profilePictureUrl) {
      id
      profilePictureUrl
    }
  }
`;

export const CREATE_BOOKING = `
  mutation CreateBooking($userId: Int!, $concertId: Int!, $zoneId: Int!, $seatCount: Int!, $seatIds: [Int!]!) {
    createBooking(userId: $userId, concertId: $concertId, zoneId: $zoneId, seatCount: $seatCount, seatIds: $seatIds) {
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

export const CONFIRM_PAYMENT = `
  mutation ConfirmPayment($bookingId: Int!) {
    confirmPaymentAndGenerateTickets(bookingId: $bookingId) {
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
