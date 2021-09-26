export const parseDecimal = (n: string) => Number(n.replace(",", "."));

export const datetimeToDate = (dt: string) => dt.split("T")[0];

export const dateToDatetime = (date: string) => `${date}T12:00:00.000000`;
