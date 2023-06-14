export const subtractMinutes = (date: Date, minutes: number) => {
  date.setMinutes(date.getMinutes() - minutes);

  return date;
}
