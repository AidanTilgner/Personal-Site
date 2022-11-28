export const ButtonTypeToAction: { [type: string]: Function } = {
  contact_me: () => {
    window.location.href = "/contact";
  },
};
