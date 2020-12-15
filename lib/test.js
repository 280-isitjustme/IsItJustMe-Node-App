"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const nk_node_library_1 = require("nk-node-library");
const mongoose = require("mongoose");
const services_1 = require("./services");
const test_data_1 = require("./test-data");
const nk_js_library_1 = require("nk-js-library");
nk_js_library_1.Utils.GoogleGeocoderUtils.loadAPI('AIzaSyDl4dmvk0tBIX0-BWCaOZy0MjAcTtLHo60');
mongoose.connect(nk_node_library_1.Config.MONGO_URI + '', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
    console.log('db connected');
    setTimeout(() => { dbConnected(); }, 2000);
}).catch((err) => console.log(err));
function dbConnected() {
    return __awaiter(this, void 0, void 0, function* () {
        for (let i = 0; i < test_data_1.default.length; i++) {
            console.log('AutoInsert ', i);
            const td = test_data_1.default[i];
            const [latitude, longitude] = td['gps'].split(' ').map(x => parseFloat(x));
            const ts = new Date(td['Timestamp']);
            const tags = ['Covid', 'Vaccine'];
            ['Mask', 'Sanitizer', 'Gloves', 'Disinfectant'].forEach((v) => {
                if (!td[v])
                    tags.push(v);
            });
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
                    raw: (yield reverseLookup(td['gps'], latitude, longitude))
                },
                author: '5fd129f57df7c045744b0330'
            };
            console.log(yield services_1.PostService.create(null, post, true));
            yield new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(true);
                }, 500);
            });
        }
        console.log('done');
    });
}
const gpsMap = {};
function reverseLookup(gps, latitude, longitude) {
    return __awaiter(this, void 0, void 0, function* () {
        if (gpsMap[gps])
            return gpsMap[gps];
        const result = (yield nk_js_library_1.Utils.GoogleGeocoderUtils.reverseLookup(latitude, longitude))[0];
        gpsMap[gps] = result;
        return result;
    });
}
