import dayjs from 'dayjs';

export const formatDate = (date: string | Date, format = 'YYYY-MM-DD') => dayjs(date).format(format);
