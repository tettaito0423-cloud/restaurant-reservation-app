import styles from './DinnerManager.module.css';
import {DinnerSlot} from '../../../../../lib/getTimetable'

export default function NarrowDown({
    dinnerSlotData,
    selectedDinnerSlotIds,
    selectedGuestCount,
    smallParty, 
    mediumParty,
    largeParty,
    }:{
    dinnerSlotData: DinnerSlot[];
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
            
        </div>
    );
}