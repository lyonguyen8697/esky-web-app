import * as moment from 'moment';

moment.locale('vi');

export class TimeUtil {

    static fromNow(time) {
        return moment(time).fromNow();
    }
}
