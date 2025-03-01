class Speedrun {
    public player!: string;
    public user_id!: string;
    public level!: string;
    public category!: string;
    public platform!: string;
    public video_platform!: string;
    public video_id!: string;
    public country!: string;
    public country_code!: string;
    public time!: string;
    public fastest!: boolean;
    public get player_url(): string {
        switch (this.video_platform) {
            case "哔哩哔哩":
                return `https://space.bilibili.com/${this.user_id}`;
            case "YouTube":
                return `https://www.youtube.com/channel/${this.user_id}`;
            case "Twitch":
                return `https://www.twitch.tv/${this.user_id}`;
            default:
                return "";
        }
    }
    public get video_url(): string {
        switch (this.video_platform) {
            case "哔哩哔哩":
                return `https://www.bilibili.com/video/${this.video_id}`;
            case "YouTube":
                return `https://www.youtube.com/watch?v=${this.video_id}`;
            case "Twitch":
                return `https://www.twitch.tv/videos/${this.video_id}`;
            default:
                return "";
        }
    }
}

export default Speedrun;