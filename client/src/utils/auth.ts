export const getInitialsFromFullName = (fullName: string) => {
  if (!fullName) return "U";

  const nameParts = fullName.trim().split(/\s+/); // handles multiple spaces
  const initials = nameParts
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return initials;
};
