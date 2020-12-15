import { Repositories } from 'nk-node-library';
declare class TagRepository extends Repositories.BaseRepository {
    constructor();
    updateTag: (tag: string, increment: boolean) => Promise<any>;
    getTagsByTagList: (tags: string[]) => Promise<any[]>;
}
export default TagRepository;
