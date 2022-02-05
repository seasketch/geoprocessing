export const randomInt = (max = Number.MAX_VALUE) =>
  Math.floor(Math.random() * Math.floor(max));

export const randomFloat = (min = 0, max = Number.MAX_VALUE) =>
  Math.random() * (max - min) + min;
