import {Repositories} from 'nk-node-library';
import {RefreshToken} from '../models';

class RefreshTokenRepository extends Repositories.BaseRepository {
    constructor(){
        super(RefreshToken);
    }

    //whitelisted refresh token count
    getActiveRefreshTokenCount = async(refreshToken : string) => {
        let temp:any = {
            refreshToken:{
                value:refreshToken,
                expiryTime:{
                    $gt:Date.now()
                }
            }
        };

        temp = {
            $and:[
                {"refreshToken.value":refreshToken},
                {
                    "refreshToken.expiryTime":{
                        $gt:Date.now()
                    }
                }
            ]
        }

        console.log('getActiveRefreshTokenCount',temp);
        temp = await this.model.count(
          temp  
        )
        console.log('getActiveRefreshTokenCount',temp);
        return temp;
    }

    //sign_out
    removeByRefreshToken = async(refreshToken : string) => {
        return await this.model.deleteOne({"refreshToken.value":refreshToken});
    }

    //sign_out_all
    removeAllByUserId = async(userId : string) => {
        return await this.model.deleteMany({userId});
    }

    update = async(entity) => {
        console.log('blocked method')
    }

}

export default RefreshTokenRepository;