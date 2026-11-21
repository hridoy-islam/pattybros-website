// Every date and time in the app is London time, wherever the server or the visitor is.
import moment from "moment-timezone";

export const TZ = "Europe/London";
moment.tz.setDefault(TZ);

export const DATE_FMT = "YYYY-MM-DD";

/** Now, in London */
export const now = () => moment.tz(TZ);

/** A London calendar day from "YYYY-MM-DD" (start of the day) */
export const day = (iso: string) => moment.tz(iso, DATE_FMT, true, TZ);

/** A London date and time from "YYYY-MM-DD" and "HH:mm" */
export const at = (iso: string, time: string) => moment.tz(`${iso} ${time}`, `${DATE_FMT} HH:mm`, true, TZ);

/** Today's date in London as "YYYY-MM-DD" */
export const todayIso = () => now().format(DATE_FMT);

export default moment;
