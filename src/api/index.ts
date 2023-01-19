export const submitUserVerify = async (
  id: number,
  message: string,
  signature: string
) => {
  const data = { id, message, signature };

  return await fetch((process.env as any).API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};
