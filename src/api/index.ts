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
