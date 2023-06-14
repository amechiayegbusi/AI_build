export const getLotteryImgPath = (name: string, type: string): string => {
  if (type === 'background') {
    return `${process.env.API_HOST}/assets/lotteries/${name}/background.png`;
  } else if (type === 'logo') {
    return `${process.env.API_HOST}/assets/lotteries/${name}/logo.svg`;
  } else if (type === 'ball') {
    return `${process.env.API_HOST}/assets/lotteries/${name}/ball.png`;
  }
  return '';
}
