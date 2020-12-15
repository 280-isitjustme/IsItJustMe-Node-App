import { Config } from 'nk-node-library';
import * as mongoose from 'mongoose';
import { PostService } from "./services";

import testData from './test-data';

import { Utils } from 'nk-js-library';

Utils.GoogleGeocoderUtils.loadAPI('AIzaSyDl4dmvk0tBIX0-BWCaOZy0MjAcTtLHo60');

// let tagRepository:TagRepository;

mongoose.connect(Config.MONGO_URI + '', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('db connected');
        setTimeout(() => { dbConnected(); }, 2000)
    }).catch((err: mongoose.Error) => console.log(err));

async function dbConnected() {

    for (let i = 0; i < testData.length; i++) {
        console.log('AutoInsert ', i);
        const td = testData[i];

        const [latitude, longitude] = td['gps'].split(' ').map(x => parseFloat(x));

        const ts = new Date(td['Timestamp']);

        const tags = ['Covid', 'Vaccine'];

        ['Mask', 'Sanitizer', 'Gloves', 'Disinfectant'].forEach((v) => {
            if (!td[v])
                tags.push(v);
        })


        const post = {
            content: {
                title: `What is up with ${tags.join(', ')}?`,
                body: '',
                tags: tags.map(t => t.toLowerCase())
            },
            createdAt: ts,
            lastModifiedAt: ts,
            threadLastUpdatedAt: ts,
            location: {
                latitude,
                longitude,
                raw: (await reverseLookup(td['gps'], latitude, longitude))
            },
            author: '5fd129f57df7c045744b0330'
        };


        console.log(await PostService.create(null, post, true));

        await new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(true);
            }, 500)
        })
    }
    console.log('done')
}

const gpsMap = {};

async function reverseLookup(gps: string, latitude: number, longitude: number) {
    if (gpsMap[gps]) return gpsMap[gps];
    const result = (await Utils.GoogleGeocoderUtils.reverseLookup(latitude, longitude))[0];
    gpsMap[gps] = result;
    return result
}

// async function test1(){
//     console.log('Test 1')
//     const steps = [
//         {
//             type:'u',
//             val:'apple',
//             inc:true
//         },
//         {
//             type:'u',
//             val:'ball',
//             inc:true
//         },
//         {
//             type:'u',
//             val:'cat',
//             inc:true
//         },
//         {
//             type:'l',
//             val:'apple',
//             verify:1
//         },
//         {
//             type:'l',
//             val:'ball',
//             verify:1
//         },
//         {
//             type:'l',
//             val:'cat',
//             verify:1
//         },
//         {
//             type:'u',
//             val:'apple',
//             inc:true
//         },
//         {
//             type:'u',
//             val:'ball',
//             inc:true
//         },
//         {
//             type:'u',
//             val:'cat',
//             inc:false
//         },
//         {
//             type:'u',
//             val:'dog',
//             inc:true
//         },
//         {
//             type:'l',
//             val:'apple',
//             verify:2
//         },
//         {
//             type:'l',
//             val:'ball',
//             verify:2
//         },
//         {
//             type:'l',
//             val:'cat',
//             verify:0
//         },
//         {
//             type:'l',
//             val:'dog',
//             verify:1
//         },
//         {
//             type:'dl',
//             arr:['apple','ball','cat','dog']
//         }
//     ];

//     for (const step of steps) {
//         console.log(step);
//         if(step.type==='u'){
//             console.log(await tagRepository.updateTag(step.val||'',step.inc||false));
//         }else if(step.type==='l'){
//             const l = await tagRepository.getOne({tag:step.val});
//             console.log(step,l, step.verify === l.count);
//         }else if(step.type==='dl'){
//             for (const t of step.arr||[]) {
//                 await tagRepository.deleteOne({tag:t});
//                 console.log('deleted',t);
//             }
//         }
//     }

// }

// setTimeout(() => {
//     Utils.GoogleGeocoderUtils.reverseLookup(38.665788, -121.156467).then((result) => {
//         console.log(result);
//         result
//         Utils.GoogleGeocoderUtils.reverseLookup(18.451093, 79.120607).then((result) => {
//             console.log(result);
//         }).catch((err) => { console.error(err) })
//     }).catch((err) => { console.error(err) })
// }, 3000)

// console.log(testData[0]);