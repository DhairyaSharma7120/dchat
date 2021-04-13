const getRecipientPhoneNumber = (users, userLoggedIn) =>
  users?.filter(
    (userToFilter) => userToFilter !== userLoggedIn?.phoneNumber
  )[0];
export default getRecipientPhoneNumber;
