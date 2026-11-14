import { dateSelectionJoinTransformer } from "@fullcalendar/core/internal";

export type Reservation = {
  id: number;
  roomNumber: string;
  adultCount: number;
  childMealCount: number;
  childNoMealCount: number;
  checkin: string;
  checkout: string;
  dietaryRestrictions: string;
  comment: string;
  courseType: string;
  dinnerSlotId: number;
}

export const fetchReservation = async (date: string)=>{
    const res = await fetch(
      `/api/users?date=${date}`
    );
    const json= await res.json();
    console.log("json", json)
    return json;
};