import {PriorityType} from './Type';

export const formatPriority = (priority: PriorityType) => {
  switch (priority) {
    case 'high':
      return 'Cao';
    case 'medium':
      return 'Trung bình';
    case 'low':
      return 'Thấp';
    default:
      break;
  }
};

export const formatTime = (timestamp: number | undefined) => {
  const currentDateTimestamp = Date.now();

  if (!timestamp || currentDateTimestamp > timestamp) {
    return `Đã quá hạn`;
  }

  const timeRemaining = timestamp - currentDateTimestamp;

  const millisecondsPerDay = 1000 * 3600 * 24;
  const daysRemaining = timeRemaining / millisecondsPerDay;

  const roundedDaysRemaining = Math.ceil(daysRemaining);

  return `Còn ${roundedDaysRemaining} ngày`;
};

export const formatDate = (timestamp: Date) => {
  const date = new Date(timestamp);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const formattedDate = `${day}/${month}/${year}`;

  return formattedDate;
};
