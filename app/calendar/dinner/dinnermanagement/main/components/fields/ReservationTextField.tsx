type Props = {
    mode: "create"|"detail";
    label: string;
    value: string;
    onChange?: (value: string) => void;
};

export default function ReservationTextField({
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
                    type = "text"
                    value = {value}
                    onChange = {(e) => onChange?.(e.target.value)} 
                />
            ) : (
                <div>{value}</div>
            )}
        </div>
    )
}