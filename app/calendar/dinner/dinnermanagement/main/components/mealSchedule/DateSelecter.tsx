type Props = {
    mode: "create" | "detail";
    dates: string[];
    checkin: string;
    checkout: string;
    setSelectedDate: (date: string) => void;
};

export default function DateSelecter({
    mode,
    dates,
    checkin,
    checkout,
    setSelectedDate,
}: Props) {
    return(
        <div>
            {mode === "create" ? (
                <div>
                    {dates.map((day) =>
                        <div key = {day}>
                            <label
                                onClick = {() =>
                                    setSelectedDate(day)
                                }>{day}
                                <input
                                    type="radio"
                                    name = "date"
                                    defaultChecked = {day === `${new Date(checkin).getMonth() + 1}/${new Date(checkin).getDate()}`}
                                />
                            </label>
                        </div>
                    )}
                </div>
            ) : (
                <div></div>
            )}
        </div>
    )
}