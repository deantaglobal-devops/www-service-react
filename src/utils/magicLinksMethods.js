import { api } from "../services/api";

export async function generateToken(tokenData) {
  const token = await api
    .post("/token/create/simple", { data: tokenData })
    .then((response) => response.data.token)
    .catch(() => {
      // console.log(err);
      // We have to settle which response errors might be and how to manage them.
    });
  return token;
}

export async function generateMagicLink(magicLinkData, section) {
  const token = await generateToken(magicLinkData);
  let magicCode = "";
  if (section === "password-reset") {
    magicCode = await api
      .post("/magic-link/reset-password", { token })
      .then((response) => response?.data?.magicCode)
      .catch(() => {
        // console.log(err);
        // We have to settle which response errors might be and how to manage them.
      });
  } else {
    magicCode = await api
      .post("/magic-link/invite-user", { token })
      .then((response) => response?.data?.magicCode)
      .catch(() => {
        // console.log(err);
        // We have to settle which response errors might be and how to manage them.
      });
  }
  const magicLink = `${import.meta.env.VITE_URL_SERVICE}/${
    section === "invite-user" ? "sign-up" : section
  }/${magicCode}`;
  return magicLink;
}
