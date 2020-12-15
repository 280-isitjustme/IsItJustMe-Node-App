import {Repositories} from 'nk-node-library';
import * as mongoose from 'mongoose';

class StatsRepository extends Repositories.AuthorRepository {
    constructor(model : mongoose.Model<any,{}>){
        super(model);
    }

    updateStat = async(entityId,property:string,increase:boolean) => {
        const query = {}
        query["stats."+property] = increase ? 1 : -1;
        return await this.model.findOneAndUpdate({ _id:entityId },{$inc:query},{new:true})
    }

    updateStatMany = async(entityId,data:{property:string,increase:number}[]) => {
        const query = {}
        data.forEach((d)=>{
            query["stats."+d.property] = d.increase;
        })
        return await this.model.findOneAndUpdate({ _id:entityId },{$inc:query},{new:true})
    }
}

export default StatsRepository;