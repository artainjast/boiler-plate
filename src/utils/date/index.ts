import jalaali from 'jalaali-js';

export function convertToJalali(isoString) {
  const date = new Date(isoString);

  // Convert Gregorian to Jalali
  const { jy, jm, jd } = jalaali.toJalaali(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
  );

  // Format the time in Persian digits
  const timeFormatter = new Intl.DateTimeFormat('fa-IR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const time = timeFormatter.format(date);

  // Return formatted Jalali date and Persian time
  return `${jy}/${jm}/${jd} - ${time}`;
}

export function convertSecondsToTime(seconds) {
  const h = Math.floor(seconds / 3600); // Get hours
  const m = Math.floor((seconds % 3600) / 60); // Get remaining minutes
  const s = seconds % 60; // Get remaining seconds

  // Format with leading zeros if needed
  const formattedTime = [h, m, s].map((num) => num.toString().padStart(2, '0')).join(':');

  return formattedTime;
}
