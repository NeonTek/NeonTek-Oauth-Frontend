/**
 * Generates initials from a name and a unique background color based on the name.
 * @param name - The user's full name or email.
 * @returns An object with initials and a hex color code.
 */
export const generateAvatar = (name: string = '') => {
  // Get initials (up to 2 letters)
  const initials = name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'NN'; // Default to 'NN' for NeonTek if no name

  // Generate a consistent, unique color from the name string
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash; // Ensures it's a 32bit integer
  }
  const color = `hsl(${hash % 360}, 75%, 60%)`;

  return { initials, color };
};