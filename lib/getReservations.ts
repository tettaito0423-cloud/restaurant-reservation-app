export type Reservation = {
  id: number;
  
}

export const fetchReservation = async (date: string)=>{
    const res = await fetch(
      `/api/users?date=${date}`
    );
    const json:Reservation[] = await res.json();
    return json;
};