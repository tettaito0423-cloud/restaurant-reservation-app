import styles from './DinnerManager.module.css';
import {DinnerSlot} from '../../../../lib/getTimetable'
import {Reservation} from '../../../../lib/getReservations'

export default function DinnerManager({
    scheData
}:{
    scheData:DinnerSlot[];
}) {
    return (
        <div>
            <div className={styles.card}>
                <div>
                    <p>{scheData[0].startAt}</p>
                    <p>1~2名</p>
                    <p>3名</p>
                    <p>4名~</p>
                </div>
                <div>
                    <p>{scheData[1].startAt}</p>
                    <p>1~2名</p>
                    <p>3名</p>
                    <p>4名~</p>
                </div>
            </div>
            <div>
                <p>時間未定</p>
            </div>

        </div>
    );
}