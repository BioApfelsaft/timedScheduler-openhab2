
export interface ILineInfo {
    dayKey: string;
    display: string;
}

export class Constants {

    public static LINE_INFOS: ILineInfo[] = [
        { dayKey: "mo", display: "Monday" },
        { dayKey: "tu", display: "Tuesday" },
        { dayKey: "we", display: "Wednesday" },
        { dayKey: "th", display: "Thursday" },
        { dayKey: "fr", display: "Friday" },
        { dayKey: "sa", display: "Saturday" },
        { dayKey: "su", display: "Sunday" }
    ];

    public static SECTIONS_PER_DAY: number = 96;

    public static getLineInfoByDayKey(dayKey : string) : ILineInfo {
        for(let i = 0; i < this.LINE_INFOS.length; i++) {
            if(this.LINE_INFOS[i].dayKey == dayKey)
                return this.LINE_INFOS[i];
        }

        throw 'Constants.getLineInfoByDayKey() - dayKey not found(' + dayKey + ')';
    }

} 

