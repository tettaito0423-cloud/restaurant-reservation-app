import { dateSelectionJoinTransformer } from "@fullcalendar/core/internal";

export const fetchReservation = async (date: string)=>{
    const res = await fetch(
      `/api/users?date=${date}`
    );
    const json= await res.json();
    console.log("jason",json)
    return json;
};