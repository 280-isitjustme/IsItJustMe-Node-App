
import { Utils } from 'nk-js-library';

export async function reverseLookup(location) {
    try {
        const result = await Utils.GoogleGeocoderUtils.reverseLookup(location.latitude, location.longitude);
        if (result.length > 0)
            return result[0];
    } catch (error) {

    }
    return {};
}