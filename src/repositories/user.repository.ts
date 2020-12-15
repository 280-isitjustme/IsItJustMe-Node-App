import {Repositories} from 'nk-node-library';
import {User} from '../models';

class UserRepository extends Repositories.BaseRepository {
    constructor(){
        super(User);
    }

    getUserByEmail = async(email : string) => {
        return await this.model.findOne({email})
    }

    getUserByUserId = async(userId : string) => {
        console.log('UserRepository','getUserByUserId',userId)
        return await this.model.findOne({userId})
    }

    getUsersByUserIds = async(userIds:string[]) => {
        return await this.model.find({"userId":{$in:userIds}});
    }

    updateUserByEmail = async(email : string,entity) => {
        delete entity.userId;
        delete entity.email;
        return await this.model.findOneAndUpdate({email},entity,{new:true,useFindAndModify:true})
    }

    updateUserByUserId = async(userId : string,entity) => {
        delete entity.userId;
        console.log('UserRepository','updateUserByUserId',userId,entity)
        return await this.model.findOneAndUpdate({userId},{$set:entity},{new:true,useFindAndModify:true})
    }

}

export default UserRepository;