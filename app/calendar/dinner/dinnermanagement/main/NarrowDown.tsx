import styles from './DinnerManager.module.css';
import {DinnerSlot} from '../../../../lib/getTimetable'
import {Reservation} from '../../../../lib/getReservations'

export default function NarrowDown({
    scheData,
    updateSelectedDinnerSlotId,
    updateSelectedGuestCount,
    selectedDinnerSlotIds,
    selectedGuestCount,
    smallParty, 
    mediumParty,
    largeParty,
    }:{
    scheData: DinnerSlot[];
    updateSelectedDinnerSlotId: any;
    updateSelectedGuestCount: any;
    selectedDinnerSlotIds: number[];
    selectedGuestCount: number[];
    smallParty: number;
    mediumParty: number;
    largeParty: number;
}) {
    return (
        <div className={styles.btnContainer}>
            <div>
                {scheData.map((dinnerSlot)=>(
                    <button 
                        className={`
                            ${styles.btn} 
                            ${styles.btnLine} 
                            ${styles.dinnerSlotBtn} 
                            ${selectedDinnerSlotIds.includes(dinnerSlot.id) ? styles.selected : ""}
                        `}
                        key = {dinnerSlot.id}
                        onClick={()=>{
                            updateSelectedDinnerSlotId(dinnerSlot.id)
                        }}
                    >
                        {dinnerSlot.startAt}
                    </button>
                ))}
            </div>
            <div>
                <button 
                    className={`${styles.btn} ${styles.btnLine} ${selectedGuestCount.includes(smallParty) ? styles.selected : ""}`}
                    key = {smallParty}
                    onClick={()=>{
                        updateSelectedGuestCount(smallParty)
                    }}
                >
                    1・2人
                </button>
                <button
                    className={`${styles.btn} ${styles.btnLine} ${selectedGuestCount.includes(mediumParty) ? styles.selected : ""}`}
                    key = {mediumParty}
                    onClick={()=>{
                        updateSelectedGuestCount(mediumParty)
                    }}
                >
                    3人
                </button>
                <button 
                    className={`${styles.btn} ${styles.btnLine} ${selectedGuestCount.includes(largeParty) ? styles.selected : ""}`}
                    key = {largeParty} 
                    onClick={()=>{
                        updateSelectedGuestCount(largeParty)
                    }}  
                >
                    4人以上
                </button>
            </div>
        </div>
    );
}