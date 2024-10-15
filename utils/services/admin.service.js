import { authHeader } from './auth-header';
import { handleResponse } from './response';
import { useDataStore } from '@/stores/data'

export const adminService = {
    deleteActor,
    uploadFile,
    updateActor,
    addIntuitionPack,
    deleteIntuitionPack,
    deleteIntuitionItemPack,
    addCastPack,
    deleteCastPack,
    deleteCastItemPack,
    addQuizPack,
    deleteQuizPack,
    deleteQuizItemPack,
    updateMovie,
    addImage,
    deleteImage,
    addSlide,
    deleteSlide,
    getSlides
};

async function deleteActor(payload) {
    const requestOptions = {
        method: 'DELETE',
        headers: await authHeader(),
        body: JSON.stringify(payload)
    };
    const dataStore = useDataStore()
    return fetch(`/api/admin/actors`, requestOptions)
        .then(handleResponse)
        .then(resp => {
            dataStore.setActors(resp)
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

async function updateMovie(payload) {
    const requestOptions = {
        method: 'POST',
        headers: await authHeader(),
        body: JSON.stringify(payload)
    };
    return fetch(`/api/admin/movie`, requestOptions)
        .then(handleResponse)
        .then(resp => {
            return resp;
        });
}


async function uploadFile(form) {
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
async function addIntuitionPack(payload) {
    const requestOptions = {
        method: 'POST',
        headers: await authHeader(true),
        body: JSON.stringify(payload)
    };
    return fetch(`/api/admin/intuition`, requestOptions)
        .then(handleResponse)
        .then(resp => {
            return resp;
        });
}

async function deleteIntuitionPack(payload) {
    const requestOptions = {
        method: 'DELETE',
        headers: await authHeader(),
        body: JSON.stringify(payload)
    };
    const dataStore = useDataStore()
    return fetch(`/api/admin/intuition`, requestOptions)
        .then(handleResponse)
        .then(resp => {
            dataStore.setPacksIntuition(resp)
            return resp;
        });
}

async function deleteIntuitionItemPack(payload) {
    const requestOptions = {
        method: 'DELETE',
        headers: await authHeader(),
        body: JSON.stringify(payload)
    };
    const dataStore = useDataStore()
    return fetch(`/api/admin/intuitionItem`, requestOptions)
        .then(handleResponse)
        .then(resp => {
            dataStore.setPacksIntuition(resp)
            return resp;
        });
}

async function addCastPack(payload) {
    const requestOptions = {
        method: 'POST',
        headers: await authHeader(true),
        body: JSON.stringify(payload)
    };
    return fetch(`/api/admin/cast`, requestOptions)
        .then(handleResponse)
        .then(resp => {
            return resp;
        });
}

async function deleteCastPack(payload) {
    const requestOptions = {
        method: 'DELETE',
        headers: await authHeader(),
        body: JSON.stringify(payload)
    };
    const dataStore = useDataStore()
    return fetch(`/api/admin/cast`, requestOptions)
        .then(handleResponse)
        .then(resp => {
            dataStore.setPacksCast(resp)
            return resp;
        });
}

async function deleteCastItemPack(payload) {
    const requestOptions = {
        method: 'DELETE',
        headers: await authHeader(),
        body: JSON.stringify(payload)
    };
    const dataStore = useDataStore()
    return fetch(`/api/admin/castItem`, requestOptions)
        .then(handleResponse)
        .then(resp => {
            dataStore.setPacksCast(resp)
            return resp;
        });
}



async function addQuizPack(payload) {
    const requestOptions = {
        method: 'POST',
        headers: await authHeader(true),
        body: JSON.stringify(payload)
    };
    return fetch(`/api/admin/quiz`, requestOptions)
        .then(handleResponse)
        .then(resp => {
            return resp;
        });
}

async function deleteQuizPack(payload) {
    const requestOptions = {
        method: 'DELETE',
        headers: await authHeader(),
        body: JSON.stringify(payload)
    };
    const dataStore = useDataStore()
    return fetch(`/api/admin/quiz`, requestOptions)
        .then(handleResponse)
        .then(resp => {
            dataStore.setPacksQuiz(resp)
            return resp;
        });
}

async function deleteQuizItemPack(payload) {
    const requestOptions = {
        method: 'DELETE',
        headers: await authHeader(),
        body: JSON.stringify(payload)
    };
    const dataStore = useDataStore()
    return fetch(`/api/admin/quizItem`, requestOptions)
        .then(handleResponse)
        .then(resp => {
            dataStore.setPacksQuiz(resp)
            return resp;
        });
}



async function addImage(payload) {
    const requestOptions = {
        method: 'POST',
        headers: await authHeader(true),
        body: JSON.stringify(payload)
    };
    return fetch(`/api/admin/image`, requestOptions)
        .then(handleResponse)
        .then(resp => {
            return resp;
        });
}
async function deleteImage(payload) {
    const requestOptions = {
        method: 'DELETE',
        headers: await authHeader(true),
        body: JSON.stringify(payload)
    };
    return fetch(`/api/admin/image`, requestOptions)
        .then(handleResponse)
        .then(resp => {
            return resp;
        });
}




async function getSlides(payload) {
    const requestOptions = {
        method: 'GET',
        headers: await authHeader(true),
        body: JSON.stringify(payload)
    };
    const dataStore = useDataStore()
    return fetch(`/api/admin/slide`, requestOptions)
        .then(handleResponse)
        .then(resp => {
            dataStore.setSlides(resp)
            return resp;
        });
}
async function addSlide(payload) {
    const requestOptions = {
        method: 'POST',
        headers: await authHeader(true),
        body: JSON.stringify(payload)
    };
    const dataStore = useDataStore()
    return fetch(`/api/admin/slide`, requestOptions)
        .then(handleResponse)
        .then(resp => {
            dataStore.setSlides(resp)
            return resp;
        });
}
async function deleteSlide(payload) {
    const requestOptions = {
        method: 'DELETE',
        headers: await authHeader(true),
        body: JSON.stringify(payload)
    };
    const dataStore = useDataStore()
    return fetch(`/api/admin/slide`, requestOptions)
        .then(handleResponse)
        .then(resp => {
            dataStore.setSlides(resp)
            return resp;
        });
}