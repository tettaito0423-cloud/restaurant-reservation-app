type Props = {
    mode: "create"|"detail";
    label: string;
    value: string;
    onChange?: (value: number) => void;
};

export default function ReservationRadioField({
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
                    type = "radio"
                    value = {value}
                    onChange = {(e) => onChange?.(Number(e.target.value))}
                />
            ) : (
                <div>{value}</div>
            )}
        </div>
    )
}