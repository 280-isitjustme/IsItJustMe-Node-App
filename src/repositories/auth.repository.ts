import {Repositories} from 'nk-node-library';
import {Auth} from '../models';

class AuthRepository extends Repositories.BaseRepository {
    constructor(){
        super(Auth);
    }

    getUsersByEmail = async(email : string) => {
        return await this.getAll({ email },{},5,1,[])
    }

    getAccountById = async(_id) => {
        return await this.get(_id,["account"]);
    }

    setConfirmedAt = async(_id:string,confirmedAt:Date) => {
        return this.model.updateOne({_id},{
            $set:{
                "account.confirmedAt":confirmedAt
            }
        })
    }

}

export default AuthRepository;