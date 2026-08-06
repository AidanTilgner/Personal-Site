export const getAlphanumericText = (text: string) => {
  return text.replace(/[^a-zA-Z0-9 ]/g, "");
};

export const getPrettyDate = (dtstr: string) => {
  const dt = new Date(dtstr);
  // Date-only values are UTC by specification; pin formatting to UTC so a
  // publication date does not shift backward in North American time zones.
  return dt.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
};
