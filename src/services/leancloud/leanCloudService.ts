import axios from 'axios';
import type { AxiosInstance } from 'axios';
import LeanCloudQuery from './leanCloudQuery';

class LeanCloudService {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: 'https://3dec7zyj.lc-cn-n1-shared.com/1.1/classes/',
            headers: {
                'X-LC-Id': '3Dec7Zyj4zLNDU0XukGcAYEk-gzGzoHsz',
                'X-LC-Key': 'uHF3AdKD4i3RqZB7w1APiFRF',
                'Content-Type': 'application/json',
            },
        });
    }

    // Create a new object in LeanCloud
    async create<T>(className: string, obj: T): Promise<void> {
         const json = JSON.stringify(obj);
        const response = await this.client.post<T>(className, json);
        if (response.status !== 201) {
            throw new Error('Failed to create object');
        }
    }

    // Get an object by its objectId
    async get<T>(className: string, objectId: string): Promise<T> {
        const query = new LeanCloudQuery<T>(className).get(objectId);
        const response = await this.client.get<T>(await query.build());
        if (response.status !== 200) {
            throw new Error('Failed to fetch object');
        }
        return response.data;
    }

    // Count the number of objects based on the query
    async count<T>(leanCloudQuery: LeanCloudQuery<T>): Promise<number> {
        leanCloudQuery.count();
        const response = await this.client.get<{ count: number }>(await leanCloudQuery.build());
        if (response.status !== 200) {
            throw new Error('Failed to count objects');
        }
        return response.data.count;
    }

    // Find objects based on the query
    async find<T>(leanCloudQuery: LeanCloudQuery<T>): Promise<T[]> {
        const response = await this.client.get<{ results: T[] }>(await leanCloudQuery.build());
        if (response.status !== 200) {
            throw new Error('Failed to fetch objects');
        }
        return response.data.results;
    }
}

export default LeanCloudService;