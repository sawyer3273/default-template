import {getLocalStorageWithExpiry} from '../common'
import {parseUserObject} from './user.service'
import { handleResponse } from './response';

export async function authHeader(needToken = true, headers = {'Content-Type': 'application/json'}) {
    // return authorization header with jwt token
    let user
    user = JSON.parse(getLocalStorageWithExpiry('user'));
    if (needToken) {
        user = JSON.parse(getLocalStorageWithExpiry('user'));
        if (!user || !user.token) {
            const requestOptions = {
                method: 'POST',
                headers: headers,
            };
            let newData = await fetch(`/api/user/refreshToken`, requestOptions).then(handleResponse)
            parseUserObject(newData.user)
            user = newData.user
        }
    }
    if (user && user.token) {
        headers['Authorization'] = 'Bearer ' + user.token
    } 
    return headers;
}

export async function authHeaderYandex(headers = {'Content-Type': 'application/json'}) {
    headers['Authorization'] = 'OAuth ' + process.env.yandexToken
    return headers;
}