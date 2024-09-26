import { authHeader } from './auth-header';
import { _ } from 'lodash'
import { handleResponse } from './response';
import {setLocalStorageWithExpiry} from '../common'
import { useMainStore } from '@/stores/main'

export const userService = {
    login,
    loginYandex,
    logout,
    register,
    getUser,
    customRoute,
    forgot,
    checkForgotToken,
    updatePassword
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

async function loginYandex(payload) {
    const requestOptions = {
        method: 'POST',
        headers: await authHeader(false),
        body: JSON.stringify(payload)
    };
    return fetch(`/api/user/loginYandex`, requestOptions)
        .then(handleResponse)
        .then(data => {
            let user = data.user
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
    const mainStore = useMainStore()
    mainStore.setUser(null)
    localStorage.removeItem('user')
    return parsedValue
}

async function forgot(data) {
    const requestOptions = {
        method: 'POST',
        headers: await authHeader(false),
        body: JSON.stringify(data)
    };
    const mainStore = useMainStore()
    mainStore.setLoader(true)
    return fetch(`/api/user/forgot`, requestOptions).then(handleResponse);
}

async function updatePassword(data) {
    const requestOptions = {
        method: 'POST',
        headers: await authHeader(false),
        body: JSON.stringify(data)
    };
    const mainStore = useMainStore()
    mainStore.setLoader(true)
    return fetch(`/api/user/updatePassword`, requestOptions).then(handleResponse);
}

async function checkForgotToken(token) {
    const requestOptions = {
        method: 'GET',
        headers: await authHeader(false),
    };
    let data = {
        token
    }
    return fetch(`/api/user/checkForgotToken?` + new URLSearchParams(data), requestOptions).then(handleResponse)
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

async function customRoute(payload) {
    const requestOptions = {
        method: 'POST',
        headers: await authHeader(true, {}),
    };
    return fetch(`/api/scrapper/saveLinks2`, requestOptions).then(handleResponse).then(user => {
        try {
            
        } catch (error) {
            console.log('error', error)
        }
    });
}


export function parseUserObject(user) {
    let userData = user ? {
        id: user.id,
        email: user.email,
        username: user.username,
        rate: user.rate,
        role: user.role,
        token: user.token,
    } : {}
    const mainStore = useMainStore()
    mainStore.setUser(userData)
    setLocalStorageWithExpiry('user', JSON.stringify(userData), 1000 * 60 * 60 * 24 * 7)
    return userData 
}
