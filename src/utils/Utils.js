export function randomNumber(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

export const status = [
  {
    name: "Pending",
    color: "#FFB332",
  },
  {
    name: "Approved",
    color: "#1ABC9C",
  },
  {
    name: "Rejected",
    color: "#E04343",
  },
];

export const randomColorArray = [
  "#eb4d4b",
  "#686de0",
  "#be2edd",
  "#22a6b3",
  "#ff7979",
  "#f9ca24",
  "#05c46b",
  "#485460",
  "#3c40c6",
  "#0be881",
  "#0fbcf9",
  "#5352ed",
  "#7bed9f",
  "#ffa502",
  "#eccc68",
  "#1e90ff",
  "#6D214F",
  "#B33771",
  "#82589F",
  "#CBE896",
  "#AAC0AA",
  "#FCDFA6",
  "#A18276",
  "#F4B886",
  "#B63F21",
  "#E47119",
  "#F2CF66",
  "#6F4288",
];

export const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const convertSecond = (totalSecond) => {
  let timeRemaining = totalSecond;
  const convertedHour =
    totalSecond >= 3600 ? Math.floor(totalSecond / 3600) : 0;
  timeRemaining = timeRemaining - convertedHour * 3600;
  const convertedMinute =
    timeRemaining >= 60 ? Math.floor(timeRemaining / 60) : 0;
  timeRemaining = timeRemaining - convertedMinute * 60;

  const convertedSecond = timeRemaining;
  return {
    second: convertedSecond < 10 ? `0${convertedSecond}` : convertedSecond,
    minute: convertedMinute < 10 ? `0${convertedMinute}` : convertedMinute,
    hour: convertedHour + "",
  };
};

export const checkDayOff = (start, end) => {
  let result = 0;
  let temp = start;
  if (start.getDate() === end.getDate()) return 0;
  do {
    if (temp.getDay() === 0 || temp.getDay() === 6) result += 1;
    temp = new Date(temp.getTime() + 86400000);
  } while (temp.getDate() !== end.getDate());
  return result;
};

export const getMouthAndDate = (date) => {
  return `${months[date.getMonth()]} ${date.getDate()}`;
};

export const countDate = (start, end) => {
  let result = checkDayOff(start, end);
  if (start.getHours() === 0) {
    if (end.getHours() === 0)
      return (end.getTime() - start.getTime() + 86400000) / 86400000 - result;
    else return (end.getTime() - start.getTime()) / 86400000 - result;
  } else {
    if (end.getHours() === 12) {
      if (start.getDate() === end.getDate()) return 0.5;
      else return (end.getTime() - start.getTime()) / 86400000 - result;
    } else
      return (end.getTime() - start.getTime() + 86400000) / 86400000 - result;
  }
};

export const convertSalary = (number) => {
  if (number < 1000) return number;
  else {
    let temp = number;
    let split = [];
    let result = "";
    do {
      split.push(temp % 1000);
      temp = Math.floor(temp / 1000);
    } while (temp >= 1);
    for (let i = split.length - 1; i >= 0; i--) {
      if (i === 0) {
        if (split[i] === 0) result += "000";
        else result += split[i];
      } else {
        if (split[i] === 0) result += "000.";
        else result += split[i] + ".";
      }
    }
    return result;
  }
};

export const convertSecondToHour = (seconds) => {
  let hours = seconds / 60 / 60;
  let rhours = Math.floor(hours);
  let rminutes = Math.round((hours - rhours) * 60);
  return `${rhours}:${rminutes < 10 ? `0${rminutes}` : rminutes}`;
};

export const convertTime = (totalSecond) => {
  const hour = totalSecond / 3600;
  const convertedHour = Math.floor(hour * 1000);
  return convertedHour / 1000;
};

export const convertToHour = (second) => {
  const hour = second / 3600;
  const convertedHour = Math.round(hour * 10);
  return convertedHour / 10;
};

export const ROLE_LIST = [
  { id: 1, name: "ADMIN", color: "2ECC71" },
  { id: 4, name: "DEV", color: "9B59B6" },
  { id: 5, name: "DESIGNER", color: "1ABC9C" },
  { id: 6, name: "TESTER", color: "E67E22" },
  { id: 7, name: "HR", color: "5962B6" },
  { id: 8, name: "SEO", color: "361D2E" },
  { id: 9, name: "MEMBER", color: "86A397" },
];

export const convertDate = (day) => {
  const date = `${day.getDate()}`;
  const stringDate = date.length === 1 ? `0${date}` : `${date}`;

  const month = `${day.getMonth() + 1}`;
  const stringMonth = month.length === 1 ? `0${month}` : `${month}`;
  return `${stringDate}-${stringMonth}-${day.getFullYear()}`;
};

export const equalDates = (date1, date2) => {
  return date1?.toDateString() === date2?.toDateString();
};

export const equalDateTime = (date1, date2) => {
  return date1?.toISOString() === date2?.toISOString();
};

export const getTimeWriteDiscussion = (createAt) => {
  let current = new Date();
  let periodOfTime = current.getTime() - new Date(createAt).getTime();
  let minute = Math.floor(periodOfTime / 1000 / 60);
  let hour = Math.floor(periodOfTime / 1000 / 3600);
  let day = Math.floor(periodOfTime / 1000 / 3600 / 24);
  if (day >= 1) return `${day} days ago`;
  else if (hour >= 1) return `${hour} hours ago`;
  else if (minute >= 1) return `${minute} minutes ago`;
  else return "Just now";
};

export const getStringDayInWeek = (date) => {
  const day = date.getDay();
  if (day === 0) return days[6];
  return days[day - 1];
};

export const getDaysOfWeek = (date) => {
  const dayInWeek = new Date(date);
  let first;
  if (dayInWeek.getDay() === 0) {
    first = dayInWeek.getDate() - 6;
  } else {
    first = dayInWeek.getDate() - (dayInWeek.getDay() - 1);
  }
  let firstDay = new Date(dayInWeek.setDate(first));
  const result = [firstDay];
  for (let i = 1; i < 7; i++) {
    let day = new Date(result[i - 1]);
    day.setDate(day.getDate() + 1);
    result.push(day);
  }
  return result;
};

export const checkDayInWeekNow = (day) => {
  const daysNow = getDaysOfWeek(new Date());
  return checkDayInWeek(day, daysNow);
};

export const checkDayInWeek = (day, week) => {
  if (week.some((ele) => equalDates(day, ele))) {
    //* is day in week now
    return 0;
  } else if (week[0] - day > 0) {
    //* is day in pre week
    return -1;
  } else if (week[6] - day < 0) {
    // * is day in next week
    return 1;
  }
};

export const removeSpace = (string) => {
  const regex = /(\s)+/g;
  return string.replaceAll(regex, " ").trim();
};

export const checkDayWithNow = (day) => {
  const now = new Date();
  if (equalDates(day, now)) {
    return 0;
  } else if (now - day > 0) {
    return -1;
  }
  return 1;
};

export const convertHours = (hour, minutes) => {
  const stringMinute = `${minutes}`.length === 1 ? `0${minutes}` : minutes;
  if (hour > 12) return `${hour - 12}:${stringMinute} PM`;
  else return `${hour}:${stringMinute} AM`;
};

//get 50 year  ( 1970 -->)
export const get50Years = (year) => {
  if (!year) year = new Date().getFullYear();
  const result = [];
  let temp = year;

  if (year < 1970) temp = 1970;
  for (let i = 0; i < 50; i++) {
    result.push(temp++);
  }
  return result;
};

export const getDaysFromSelectedDay = (amount, selectedDay) => {
  const date = new Date(selectedDay);
  const result = [date];
  for (let i = 1; i < amount; i++) {
    const temp = new Date(result[i - 1]);
    temp.setDate(temp.getDate() + 1);
    result.push(temp);
  }
  return result;
};

export const onItemChangedHandler = (
  itemWillChange,
  currentChangedList,
  key1,
  key2
) => {
  const result = [...currentChangedList];
  const index = result.findIndex((ele) => ele[key2] === itemWillChange[key1]);
  if (index === -1) {
    result.push(itemWillChange);
  } else {
    result.splice(index, 1);
  }
  return result;
};
export const onListChangedHandler = (
  listWillChange,
  currentChangedList,
  key1,
  key2
) => {
  let result = [...currentChangedList];
  listWillChange.forEach((ele) => {
    result = onItemChangedHandler(ele, result, key1, key2);
  });
  return result;
};

export const includesIgnoreCase = (stringParent, stringChild) => {
  return stringParent
    .toLocaleLowerCase()
    .includes(stringChild.toLocaleLowerCase());
};
