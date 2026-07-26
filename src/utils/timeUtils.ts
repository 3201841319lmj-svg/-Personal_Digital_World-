import { TimePeriod } from '../types';

export const getCurrentTimePeriod = (): TimePeriod => {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) {
    return 'morning';
  } else if (hour >= 12 && hour < 18) {
    return 'afternoon';
  } else {
    return 'night';
  }
};

export const getTimePeriodLabel = (period: TimePeriod): string => {
  switch (period) {
    case 'morning':
      return '晨光清晨';
    case 'afternoon':
      return '暖阳午后';
    case 'night':
      return '静谧深夜';
  }
};
