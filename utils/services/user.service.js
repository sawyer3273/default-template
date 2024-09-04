import { authHeader } from './auth-header';
import { _ } from 'lodash'
import { handleResponse } from './response';
import {setLocalStorageWithExpiry} from '../common'

export const userService = {
    login,
    logout,
    register,
    getUser,
    getPrivate
};

async function login(user) {
    const requestOptions = {
        method: 'POST',
        headers: await authHeader(false),
        body: JSON.stringify(user)
    };
    return fetch(`/api/user/login`, requestOptions)
        .then(handleResponse)
        .then(data => {
            let user = data.user
            // login successful if there's a jwt token in the response
            if (data.success && data.user.token) {
                user = parseUserObject(data.user);
            }
            return data;
        });
}


async function logout() {
    const requestOptions = {
        method: 'POST',
        headers: await authHeader(),
    };
    let response = await fetch(`/api/user/logout`, requestOptions)
    const parsedValue = await response.json()
    console.log('datadatadata',parsedValue)
    return parsedValue
}



async function register(user) {
    const requestOptions = {
        method: 'POST',
        headers: await authHeader(false),
        body: JSON.stringify(user)
    };
    return fetch(`/api/user/register`, requestOptions).then(handleResponse);
}

async function getUser() {
    const requestOptions = {
        method: 'GET',
        headers: await authHeader(),
    };
    let data = {
    }
    return fetch(`/api/user?` + new URLSearchParams(data), requestOptions).then(handleResponse).then(user => {
        try {
            return parseUserObject(user);
        } catch (error) {
            console.log('error', error)
        }
        
    });
}

async function getPrivate() {
    const requestOptions = {
        method: 'GET',
        headers: await authHeader(),
    };
    let data = {
    }
    return fetch(`/api/user/private?` + new URLSearchParams(data), requestOptions).then(handleResponse).then(user => {
        try {
            
        } catch (error) {
            console.log('error', error)
        }
        
    });
}


export function parseUserObject(user) {
    let userData = {
        id: user.id,
        email: user.email,
        username: user.username,
        rate: user.rate,
        role: user.role,
        token: user.token,
    }
    setLocalStorageWithExpiry('user', JSON.stringify(userData), 1000 * 60 * 5)
    return userData 
}

