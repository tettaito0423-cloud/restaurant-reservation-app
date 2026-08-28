export type Reservation = {
  id: number
  dinnerSlotId: number;
  guestCount: number;
  roomNumber: number;
}

export const fetchReservation = async (dinnerSlotId_1: number, dinnerSlotId_2:number)=>{
    const res = await fetch(
      `/api/users?dinnerSlotId_1=${dinnerSlotId_1}&dinnerSlotId_2=${dinnerSlotId_2}`
    )
    const json:Reservation[] = await res.json();
    return json
};