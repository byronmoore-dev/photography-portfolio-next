export const variants = {
  enter: (direction: number) => {
    return {
      opacity: 0,
    };
  },
  center: {
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      opacity: 0,
    };
  },
};
