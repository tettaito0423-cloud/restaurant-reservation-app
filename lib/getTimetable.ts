
export type DinnerSlot = {
  id: number;
  startAt: string;
  meals: [];
};



export const fetchSchedule = async (date:string) => {
  const res = await fetch(`/api/save?date=${date}`);
  const json:DinnerSlot[] = await res.json();
  return json
};