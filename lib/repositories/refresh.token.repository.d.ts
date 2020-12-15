import { Repositories } from 'nk-node-library';
declare class RefreshTokenRepository extends Repositories.BaseRepository {
    constructor();
    getActiveRefreshTokenCount: (refreshToken: string) => Promise<any>;
    removeByRefreshToken: (refreshToken: string) => Promise<any>;
    removeAllByUserId: (userId: string) => Promise<any>;
    update: (entity: any) => Promise<void>;
}
export default RefreshTokenRepository;
