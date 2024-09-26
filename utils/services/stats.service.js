import { authHeader } from './auth-header';
import { handleResponse } from './response';
import { useMainStore } from '@/stores/main'

export const statsService = {
    saveIntuition,
};

async function saveIntuition(payload) {
    const requestOptions = {
        method: 'POST',
        headers: await authHeader(),
        body: JSON.stringify(payload)
    };
    return fetch(`/api/stats/intuition`, requestOptions).then(handleResponse).then(user => {
        try {
            
        } catch (error) {
            console.log('error', error)
        }
    });
}

