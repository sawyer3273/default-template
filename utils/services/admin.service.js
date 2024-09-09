import { authHeader } from './auth-header';
import { handleResponse } from './response';
import { useMainStore } from '@/stores/main'

export const adminService = {
    getActors,
    deleteActor
};

async function getActors(payload) {
    const requestOptions = {
        method: 'Get',
        headers: await authHeader(),
    };
    const mainStore = useMainStore()
    return fetch(`/api/admin/actors?` + new URLSearchParams(payload), requestOptions)
        .then(handleResponse)
        .then(resp => {
            mainStore.setActors(resp)
            return resp;
        });
}


async function deleteActor(payload) {
    const requestOptions = {
        method: 'DELETE',
        headers: await authHeader(false),
        body: JSON.stringify(payload)
    };
    const mainStore = useMainStore()
    return fetch(`/api/admin/actors`, requestOptions)
        .then(handleResponse)
        .then(resp => {
            mainStore.setActors(resp)
            return resp;
        });
}
