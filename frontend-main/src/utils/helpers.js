export const capitalize = (
  text
) => {

  if (!text)
    return "";

  return (
    text.charAt(0)
      .toUpperCase() +
    text.slice(1)
  );
};

export const generateInitials =
  (name) => {

    if (!name)
      return "?";

    return name
      .split(" ")
      .map((word) =>
        word.charAt(0)
      )
      .join("")
      .toUpperCase();
  };