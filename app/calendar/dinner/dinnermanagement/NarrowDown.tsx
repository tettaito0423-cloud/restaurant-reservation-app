import styles from './DinnerManager.module.css';
import {DinnerSlot} from '../../../../lib/getTimetable'
import {Reservation} from '../../../../lib/getReservations'

export default function NarrowDown({
    scheData,
    updateSelectedDinnerSlotId,
    updateSelectedGuestCount,
    }:{
    scheData: DinnerSlot[];
    updateSelectedDinnerSlotId: any;
    updateSelectedGuestCount: any;
}) {
    return (
        <div className={styles.narrowDown}>
            <div>
                {scheData.map((dinnerSlot)=>(
                    <button 
                        className={`${styles.btn} ${styles.btnLine}`}
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
                    className={`${styles.btn} ${styles.btnLine}`}
                    key = {2}
                    onClick={()=>{
                        updateSelectedGuestCount(1, 2)
                    }}
                >
                    1・2人
                </button>
                <button className={`${styles.btn} ${styles.btnLine}`}>
                    3人
                </button>
                <button className={`${styles.btn} ${styles.btnLine}`}>
                    4人
                </button>
            </div>
        </div>
    );
}