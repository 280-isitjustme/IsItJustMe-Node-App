import * as auth from '../../processes/auth.process';
import * as profile from '../../processes/profile.process';
import {Test} from '../../node-library';

var expect = Test.Chai.expect;

describe('Profile',()=>{
    describe('Id',()=>{
        it('anonymous', async function () {
            let response = await profile.getAll({
                responseStatus:200
            });
            console.log(response);
            const id = response.result[0].userId;
            response = await profile.id({
                id,
                responseStatus:200
            });
            console.log(response);
            expect(response.userId).to.be.equal(id);
        });
    })
})