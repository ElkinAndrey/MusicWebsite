const getTime = (number) => {
  const m = Math.floor(number / 60);
  const s = number - m * 60;
  return `${m} мин, ${s} сек`;
};

export default getTime;
