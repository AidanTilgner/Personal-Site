export const getAlphanumericText = (text: string) => {
  return text.replace(/[^a-zA-Z0-9 ]/g, "");
};

export const getPrettyDate = (dtstr: string) => {
  const dt = new Date(dtstr);
  // formatted like Monday, Jan 1, 2020
  return dt.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
