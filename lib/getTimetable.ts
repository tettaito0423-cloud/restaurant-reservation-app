export type DinnerSlot = {
  id: number;
  startAt: string;
};



export const fetchSchedule = async (date:string) => {
  const res = await fetch(`/api/save?date=${date}`);
  const json:DinnerSlot[] = await res.json();
  console.log(json)
  return json
};