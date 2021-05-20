export type DateType = 'weekdays' | 'holidays';

export type UserTimeSchedule = {
  id: number;
  dayType: DateType;
  startTime: number;
  endTime: number;
};

export type UserTimeSchedules = UserTimeSchedule[];

export type RequestUserTimeSchedules = Omit<UserTimeSchedule, 'id'>[];

export type ResponseUserTimeSchedules = RequestUserTimeSchedules;
