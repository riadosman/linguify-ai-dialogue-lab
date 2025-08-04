export const getProgress = async ({ userId }) => {
  console.log(`Getting progress for user: ${userId}`);

  const res = await fetch(`http://localhost:3000/api/progress/${userId}`);
  const data = await res.json();
  return data;
};
