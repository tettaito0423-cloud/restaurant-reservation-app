type Props = {
    dinnerSlotData: {
        date: string,
        dinnerSlots: {
            id: number,
            dinnerStartAt: string
        }[]
    }[];
    courseType: "FULL" | "HALF" | null;
};

export default function DinnerSelecter({
    dinnerSlotData,
    courseType,
}: Props) {
    return(
        <div>
            <div>
                {dinnerSlotData.length > 0 && (
                    <div>
                        <label>夕食</label>
                        <div>
                            <label>
                                <input
                                    type="radio"
                                    name = "courseType"
                                    checked = {courseType === "FULL"}
                                    onChange = {() => 
                                        setCourseType("FULL")
                                    }
                                />フルコース
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name = "courseType"
                                    onChange = {() => 
                                        setCourseType("HALF")
                                    }
                                />ハーフコース
                            </label>
                        </div>
                    </div>
                )}
                {dinnerSlotData.filter((dinnerSlot) => dinnerSlot.date === selectedDate).map((i) =>
                    <div key = {i.date}>
                        {courseType === "FULL" && (
                            <div>
                                {i.dinnerSlots.filter((a) => a.dinnerStartAt.split("T")[1] !== "18:15").map((n) =>
                                    <div 
                                        key = {n.id}>
                                        <label>
                                            <input 
                                                type="radio"
                                                name = "dinnerSlot"
                                                value = {n.id}
                                                checked = {selectedDinnerSlots.some((selectedDinnerSlot) =>
                                                    selectedDinnerSlot.courseType === "FULL" && 
                                                        selectedDinnerSlot.dinnerSlotId === n.id
                                                )}
                                                onChange = {() => {
                                                    saveDinnerSlot(i.date, "FULL", n.id, true, n.dinnerStartAt)
                                                }}
                                            />{n.dinnerStartAt.split("T")[1]}
                                        </label>
                                    </div>
                                )}
                                <label>
                                    <input 
                                        type='radio'
                                        name = "dinnerSlot"
                                        checked = {selectedDinnerSlots.some((selectedDinnerSlot) =>
                                            selectedDinnerSlot.courseType == "FULL" &&
                                                selectedDinnerSlot.dinnerSlotId === null
                                        )}
                                        onChange={() => 
                                            saveDinnerSlot(i.date, "FULL", null, false, "")
                                        }
                                    />時間未定
                                </label>
                            </div>
                        )}
                    
                        {courseType === "HALF" && (
                            <div>
                                {i.dinnerSlots.filter((a) => a.dinnerStartAt.split("T")[1] !== "18:00").map((n) =>
                                    <div 
                                        key = {n.id}
                                    >
                                        <label>
                                            <input 
                                                type="radio"
                                                name = "dinnerSlot"
                                                value = {n.id}
                                                checked = {selectedDinnerSlots.some((selectedDinnerSlot) =>
                                                    selectedDinnerSlot.courseType === "HALF" && 
                                                        selectedDinnerSlot.dinnerSlotId === n.id
                                                )}
                                                onChange = {(e) => {
                                                    saveDinnerSlot(i.date, "HALF", n.id, true, n.dinnerStartAt)
                                                }}
                                            />{n.dinnerStartAt.split("T")[1]}
                                        </label>
                                    </div>
                                )}
                                <label>
                                    <input 
                                        type='radio'
                                        name = "dinnerSlot"
                                        checked = {selectedDinnerSlots.some((selectedDinnerSlot) =>
                                            selectedDinnerSlot.courseType == "HALF" &&
                                                selectedDinnerSlot.dinnerSlotId === null
                                        )}
                                        onChange={() => 
                                            saveDinnerSlot(i.date, "FULL", null, false, "")
                                        }
                                    />時間未定
                                </label>
                            </div>
                        )}
                        <div>

                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}