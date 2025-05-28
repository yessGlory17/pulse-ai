export const CREATE_TOKEN_KEY = "createToken";

async function createToken() {
  const response = await fetch(`/api/endpoint/token`, {
    method: "POST"
  });

  return await response.json();
}

export default createToken;
