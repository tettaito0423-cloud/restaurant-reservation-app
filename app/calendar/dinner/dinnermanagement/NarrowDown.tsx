import styles from './DinnerManager.module.css';
import {DinnerSlot} from '../../../../lib/getTimetable'
import {Reservation} from '../../../../lib/getReservations'

export default function NarrowDown({
    scheData,
}:{
    scheData: DinnerSlot[];
}) {
    return (
        <div className={styles.narrowDown}>
            <p>絞り込み</p>
            <input type="text" />
            <p>人数</p>
            <form 
                className={styles.guestCount}
                action="#" 
                method="post"
            >
                <div>
                        <input type="checkbox" name="belowTwo" value=""/>
                        <label htmlFor="belowTwo">1~2人</label>
                </div>
                <div>
                        <input type="checkbox" name="three" value=""/>
                        <label htmlFor="three">3人</label>
                </div>
                <div>
                        <input type="checkbox" name="fourOrMore" value=""/>
                        <label htmlFor="fourOrMore">4人以上</label>
                </div>
            </form>
            <p>時間</p>
            <form 
                action="#"
                method='post'
            >
                <div>
                        <input type="checkbox" name="first" value="" />
                        <label htmlFor="first">{scheData[0].startAt}</label>
                </div>
            </form>
        </div>
    );
}