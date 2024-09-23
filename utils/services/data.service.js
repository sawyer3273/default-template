import { authHeader } from './auth-header';
import { handleResponse } from './response';
import { useMainStore } from '@/stores/main'

export const dataService = {
    getActors,
    getPacksIntuition,
};

async function getActors(payload) {
    const requestOptions = {
        method: 'Get',
        headers: await authHeader(),
    };
    const mainStore = useMainStore()
    return fetch(`/api/data/actors?` + new URLSearchParams(payload), requestOptions)
        .then(handleResponse)
        .then(resp => {
            mainStore.setActors(resp)
            return resp;
        });
}

async function getPacksIntuition(payload) {
    const requestOptions = {
        method: 'Get',
        headers: await authHeader(),
    };
    const mainStore = useMainStore()
    return fetch(`/api/data/packsIntuition?` + new URLSearchParams(payload), requestOptions)
        .then(handleResponse)
        .then(resp => {
            mainStore.setPacksIntuition(resp)
            return resp;
        });
}
