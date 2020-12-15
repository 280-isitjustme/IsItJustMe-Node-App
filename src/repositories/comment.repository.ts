import {Comment} from '../models';
import StatsRepository from './stats.repository';

class CommentRepository extends StatsRepository {
    constructor(){
        super(Comment);
    }
}

export default CommentRepository;