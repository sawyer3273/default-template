import { authHeader } from './auth-header';
import { handleResponse } from './response';
import { useMainStore } from '@/stores/main'

export const adminService = {
    deleteActor
};

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
