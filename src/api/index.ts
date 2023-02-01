export const submitUserVerify = async (
  id: string,
  message: string,
  signature: string
) => {
  const data = { id: Number.parseInt(id), message, signature };

  return await fetch(`/api/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

export const submitSetup = async (
  id: string,
  message: string,
  signature: string,
  safeAddress: string
) => {
  const data = { id: Number.parseInt(id), message, signature, safeAddress };

  return await fetch(`/api/link`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};
//tbc...
