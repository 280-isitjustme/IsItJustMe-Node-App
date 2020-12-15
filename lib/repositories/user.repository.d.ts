import { Repositories } from 'nk-node-library';
declare class UserRepository extends Repositories.BaseRepository {
    constructor();
    getUserByEmail: (email: string) => Promise<any>;
    getUserByUserId: (userId: string) => Promise<any>;
    getUsersByUserIds: (userIds: string[]) => Promise<any[]>;
    updateUserByEmail: (email: string, entity: any) => Promise<any>;
    updateUserByUserId: (userId: string, entity: any) => Promise<any>;
}
export default UserRepository;
