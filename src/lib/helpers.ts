import dayjs from "dayjs";

export function transformToValidDate(dateString: string) {
  // Split the date string into day, month, and year
  const [day, month, year] = dateString.split("/");

  // Rearrange the components to the "YYYY-MM-DD" format
  const transformedDate = `${year}-${month}-${day}`;

  return transformedDate;
}

export const calculateAge = (birthdate: string) => {
  const today = dayjs();
  const birthDate = dayjs(birthdate);

  const years = today.diff(birthDate, "year");
  birthDate.add(years, "year"); // Move to the next birthday
  const months = today.diff(birthDate, "month");
  const days = today.diff(birthDate.add(months, "month"), "day");

  return {
    years,
    months,
    days,
  };
};
