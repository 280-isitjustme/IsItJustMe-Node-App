import { Repositories } from 'nk-node-library';
declare class AuthRepository extends Repositories.BaseRepository {
    constructor();
    getUsersByEmail: (email: string) => Promise<{
        query: {};
        sort: {};
        attributes: string[];
        pageSize: number;
        pageNum: number;
        resultSize: number;
        resultTotalSize: any;
        result: any[];
    }>;
    getAccountById: (_id: any) => Promise<any>;
    setConfirmedAt: (_id: string, confirmedAt: Date) => Promise<any>;
}
export default AuthRepository;
