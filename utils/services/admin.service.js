import { authHeader } from './auth-header';
import { handleResponse } from './response';
import { useMainStore } from '@/stores/main'

export const adminService = {
    deleteActor,
    uploadImage,
    updateActor
};

async function deleteActor(payload) {
    const requestOptions = {
        method: 'DELETE',
        headers: await authHeader(),
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

async function updateActor(payload) {
    const requestOptions = {
        method: 'POST',
        headers: await authHeader(),
        body: JSON.stringify(payload)
    };
    return fetch(`/api/admin/actors`, requestOptions)
        .then(handleResponse)
        .then(resp => {
            return resp;
        });
}
async function uploadImage(form) {
    const requestOptions = {
        method: 'POST',
        headers: await authHeader(true, {}),
        body: form
    };
    return fetch(`/api/admin/upload`, requestOptions)
        .then(handleResponse)
        .then(resp => {
            return resp;
        });
}

