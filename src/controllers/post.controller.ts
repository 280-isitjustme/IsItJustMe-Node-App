import {PostService} from '../services';
import {Controllers} from 'nk-node-library';

class PostController extends Controllers.BaseController{
    
    constructor(){
        super(PostService);
    }

}
export default PostController;