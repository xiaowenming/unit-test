import {apiGet, apiPost} from '../utils/request'

export const aboutImModel = {
    getImSig (data, success, fail) {
        return apiGet('/consult/v1/querySig', data, success, fail)
    },
    
}