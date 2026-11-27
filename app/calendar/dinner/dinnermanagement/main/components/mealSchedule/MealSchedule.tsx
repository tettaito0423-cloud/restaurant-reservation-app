import { useState, useEffect } from 'react';
import {fetchSchedule, DinnerSlot} from '../../../../../../../lib/getTimetable'
import DateSelecter from './DateSelecter';
import DinnerSelecter from './DinnerSelecter';

type Props = {
    mode: "create" | "detail";
    date: string;
    checkin: string;
    checkout: string;
    label: string;
    setCheckout: (date: string) => void
};

type DinnerSlotData = {
    date: string
    dinnerSlots: DinnerSlot[];
}

export default function MealSchedule({
    mode,
    date,
    checkin,
    checkout,
    label,
    setCheckout,
}: Props) {
    const [courseType, setCourseType] = useState<'FULL'|'HALF'|null>("FULL");

    const createTommorrow = (date: string) => {
        const currentDate = new Date(date);
        currentDate.setDate(currentDate.getDate() + 1);
        const tommorrow = new Intl.DateTimeFormat("ja-JP", {
            timeZone: "Asia/Tokyo",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }).format(currentDate).replace(/\//g, "-").replace(" ", "T");
        setCheckout(String(tommorrow))
        setCourseType("FULL")
    };

    {/**checkinとcheckoutから宿泊日全てを取得する処理 */}
    const [dates, setDates] = useState<string[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>(date);
    const getDays = () => {
        const start = new Date(checkin);
        const end = new Date(checkout);

        const numberOfDays = Math.floor(
            Number(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
        );
        const dayArr: string[] = [];
        for (let i = 0; i < numberOfDays; i++) {
            const day = new Date(start)
            day.setDate(start.getDate() + i)
            const fixedDay = new Intl.DateTimeFormat("ja-JP", {
                timeZone: "Asia/Tokyo",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            }).format(day).replace(/\//g, "-").replace(" ", "T");
            dayArr.push(`${new Date(fixedDay).getFullYear()}/${new Date(fixedDay).getMonth() + 1}/${new Date(fixedDay).getDate()}`)
        }
        setDates(dayArr);
        setSelectedDate(dayArr[0]);
    };

    {/**APIからデータを取得 */}
    const [dinnerSlotData, setDinnerSlotData] = useState<DinnerSlotData[]>([]);
    const getSchedule = async () => {
        const fromTo = [checkin, checkout]
        const schedule = await fetchSchedule(fromTo);
        const result = Object.groupBy(
            schedule,
            (element) => (
                `${String(new Date(element.dinnerStartAt).getFullYear())}/${String(new Date(element.dinnerStartAt).getMonth() + 1)}/${String(new Date(element.dinnerStartAt).getDate())}`
            )
        ); 
        const a = Object.entries(result).map(([key, value]) => ({
            date: key,
            dinnerSlots: value ?? []
        }));
        setDinnerSlotData(a);
    };

    useEffect(() => {
        createTommorrow(date)
    }, []);


    useEffect(() => {
        if(!checkout)return;
        getSchedule()
        getDays()
    }, [checkin, checkout]);

    console.log("dinnerSlotData", dinnerSlotData)

    return(
        <div>
            <label>{label}</label>
            <DateSelecter
                mode = {mode}
                dates = {dates}
                checkin = {checkin}
                checkout = {checkout}
                setSelectedDate = {setSelectedDate}
            />
            <DinnerSelecter
                mode = {mode}
                courseType = {courseType}
                dinnerSlotData = {dinnerSlotData}
            />
        </div>
    )
}