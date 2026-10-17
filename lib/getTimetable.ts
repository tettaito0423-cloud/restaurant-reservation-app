
export type DinnerSlot = {
  date: string;
  times:{
    id: number;
    dinnerStartAt: string;
    meals: [];
  }[]
};



export const fetchSchedule = async (dates:string[]) => {
  const res = await fetch(`/api/save?dates=${dates.join(",")}`);
  const json:DinnerSlot[] = await res.json();
  return json
};