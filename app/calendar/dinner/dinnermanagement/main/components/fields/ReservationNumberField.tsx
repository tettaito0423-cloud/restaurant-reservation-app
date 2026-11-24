type Props = {
    mode: "create"|"detail";
    label: string;
    value: number;
    onChange?: (value: number) => void;
};

export default function ReservationNumberField({
    mode,
    label,
    value,
    onChange,
}: Props) {
    return(
        <div>
            <label>{label}</label>

            {mode === "create" ? (
                <input
                    type = "number"
                    value = {value}
                    onChange = {(e) => onChange?.(Number(e.target.value))}
                />
            ) : (
                <div>{value}</div>
            )}
        </div>
    )
}