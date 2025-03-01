
class LeanCloudQuery<T> {
    private className: string;
    private objectId: string = '';
    private order?: string;
    private keys: string[] = [];
    private condition: Record<string, any> = {};
    private _limit: number = 1000;
    private _count: boolean = false;

    constructor(className: string) {
        this.className = className;
        this.deselect('createdAt', 'updatedAt', 'objectId');
    }

    private async buildQuery(): Promise<string> {
        const queryParams: Record<string, string> = {};

        if (this.order) {
            queryParams['order'] = this.order;
        }

        if (this.keys.length > 0) {
            queryParams['keys'] = this.keys.join(',');
        }

        if (Object.keys(this.condition).length > 0) {
            queryParams['where'] = JSON.stringify(this.condition);
        }

        if (this._count) {
            queryParams['count'] = '1';
        }
        queryParams['limit'] = this._limit.toString();
        const urlParams = new URLSearchParams(queryParams).toString();
        return `${this.className}${this.objectId}?${urlParams}`;
    }

    public async build(): Promise<string> {
        return await this.buildQuery();
    }

    public get(objectId: string): LeanCloudQuery<T> {
        this.objectId = `/${objectId}`;
        return this;
    }

    public orderByAscending(key: string): LeanCloudQuery<T> {
        this.order = key;
        return this;
    }

    public orderByDescending(key: string): LeanCloudQuery<T> {
        this.order = `-${key}`;
        return this;
    }

    public select(...keys: string[]): LeanCloudQuery<T> {
        this.keys.push(...keys);
        return this;
    }

    public deselect(...keys: string[]): LeanCloudQuery<T> {
        this.keys.push(...keys.map(key => `-${key}`));
        return this;
    }

    public where(key: string, value: any): LeanCloudQuery<T> {
        this.condition[key] = value;
        return this;
    }

    public limit(limit: number): LeanCloudQuery<T> {
        this._limit = limit;
        return this;
    }

    public count(): LeanCloudQuery<T> {
        this._count = true;
        this._limit = 0;
        return this;
    }
}

export default LeanCloudQuery;
