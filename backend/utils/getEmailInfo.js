
async function getEmailInfo(messageId, access_token) {
  const response = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}`,
    { headers: { Authorization: `Bearer ${access_token}` } }
  );
  const data = await response.json();
  return data.payload;
}

export default getEmailInfo;