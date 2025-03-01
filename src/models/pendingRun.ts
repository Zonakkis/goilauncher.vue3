class PendingRun {
    public level: string = "完整游戏";
    public category: string = "Glitchless";
    public platform: string = "PC";
    public video_platform: string = "哔哩哔哩";
    public video_id: string = "";
    public player: string = "";
    public country_code: string = "cn";
    public minute: number = NaN;
    public second: number = NaN;
    public millionsecond: number = NaN;
    public total_time!: number;
    public time!: string;
    public calculateTime(): void {
        this.total_time = this.minute * 60 + this.second + this.millionsecond / 1000;
        this.time = `${this.minute > 0 ? `${this.minute}分` : ""
            }${this.second.toString().padStart(
                2,
                "0"
            )}.${this.millionsecond.toString().padStart(3, "0")}秒`;
    }
}

export default PendingRun;