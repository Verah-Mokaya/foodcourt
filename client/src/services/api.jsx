export const getMenuItems = async () => {
  const res = await fetch('http://localhost:4000/menu');
  if (!res.ok) throw new Error('Failed to fetch menu');
  return res.json();
};
