import {getLocalStorageWithExpiry} from '../common'
import {parseUserObject} from './user.service'

export async function authHeader(needToken = true) {
    // return authorization header with jwt token
    let user
    user = JSON.parse(getLocalStorageWithExpiry('user'));
    if (needToken) {
        user = JSON.parse(getLocalStorageWithExpiry('user'));
        if (!user || !user.token) {
            const requestOptions = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
            };
            let newDataFetch = await fetch(`/api/user/refreshToken`, requestOptions)
            const newData = await newDataFetch.json();
            parseUserObject(newData.user)
            user = newData.user
        }
    }
    if (user && user.token) {
        return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + user.token };
    } else {
        return {'Content-Type': 'application/json'};
    }
}