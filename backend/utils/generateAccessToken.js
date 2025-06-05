async function generateAccessToken(refresh) {
  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
        client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: refresh,
      }),
    });
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error(error);
  }
}

export default generateAccessToken;
