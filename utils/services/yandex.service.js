// only server use!!!
import { authHeaderYandex } from './auth-header';
import { useMainStore } from '@/stores/main'
const yandexDiskBaseURL = 'https://cloud-api.yandex.net'

export const yandexService = {
    getUploadLink,
    uploadFile,
    getYandexUser
};

async function getYandexUser(token) {
    const requestOptions = {
        method: 'GET',
        headers: {"Authorization": "OAuth " + token},
    };
    let data = {
        format: 'json',
        jwt_secret: process.env.yandexClientSecret
    }
    return fetch(`https://login.yandex.ru/info?` + new URLSearchParams(data), requestOptions).then(response => {
        return response.text().then(text => {
            const data = text && JSON.parse(text);
            if (!response.ok) {
                return ''
            } else {
                return data
            }
        })
    });
}

async function getUploadLink(path) {
    const requestOptions = {
        method: 'GET',
        headers: await authHeaderYandex(),
    };
    let data = {
        path
    }
    return fetch(`${yandexDiskBaseURL}/v1/disk/resources/upload?` + new URLSearchParams(data), requestOptions).then(response => {
        return response.text().then(text => {
            const data = text && JSON.parse(text);
            if (!response.ok) {
                return ''
            } else {
                return data
            }
        })
    });
}

async function uploadFile(link, file) {
    const requestOptions = {
        method: 'PUT',
        body: file.buffer
    };
    return fetch(link, requestOptions).then(response => {
        return response.text().then(text => {
            const data = text && JSON.parse(text);
            if (!response.ok) {
                return ''
            } else {
                return data
            }
        })
    });
}

