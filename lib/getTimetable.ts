
export type DinnerSlot = {
    id: number;
    dinnerStartAt : string;
}



export const fetchSchedule = async (dates:string[]) => {
  const res = await fetch(`/api/save?dates=${dates.join(",")}`);
  const json: DinnerSlot[] = await res.json();
  console.log("json", json)
  return json
};