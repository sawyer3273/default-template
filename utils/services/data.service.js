import { authHeader } from './auth-header';
import { handleResponse } from './response';
import { useDataStore } from '@/stores/data'

export const dataService = {
    getActors,
    getPacksIntuition,
    getPacksCast,
    getMovies,
    getPacksQuiz,
    librarySearch,
    getRoom,
    getRooms
};

async function getActors(payload) {
    const requestOptions = {
        method: 'Get',
        headers: await authHeader(),
    };
    const dataStore = useDataStore()
    return fetch(`/api/data/actors?` + new URLSearchParams(payload), requestOptions)
        .then(handleResponse)
        .then(resp => {
            dataStore.setActors(resp)
            return resp;
        });
}

async function librarySearch(payload) {
    const requestOptions = {
        method: 'Get',
        headers: await authHeader(),
    };
    const dataStore = useDataStore()
    return fetch(`/api/data/find?` + new URLSearchParams(payload), requestOptions)
        .then(handleResponse)
        .then(resp => {
            dataStore.setSearchData(resp)
            return resp;
        });
}

async function getMovies(payload) {
    const requestOptions = {
        method: 'Get',
        headers: await authHeader(),
    };
    const dataStore = useDataStore()
    return fetch(`/api/data/movies?` + new URLSearchParams(payload), requestOptions)
        .then(handleResponse)
        .then(resp => {
            dataStore.setMovies(resp)
            return resp;
        });
}

async function getPacksIntuition(payload) {
    const requestOptions = {
        method: 'Get',
        headers: await authHeader(),
    };
    const dataStore = useDataStore()
    return fetch(`/api/data/packsIntuition?` + new URLSearchParams(payload), requestOptions)
        .then(handleResponse)
        .then(resp => {
            dataStore.setPacksIntuition(resp)
            return resp;
        });
}

async function getPacksCast(payload) {
    const requestOptions = {
        method: 'Get',
        headers: await authHeader(),
    };
    const dataStore = useDataStore()
    return fetch(`/api/data/packsCast?` + new URLSearchParams(payload), requestOptions)
        .then(handleResponse)
        .then(resp => {
            dataStore.setPacksCast(resp)
            return resp;
        });
}

async function getPacksQuiz(payload) {
    const requestOptions = {
        method: 'Get',
        headers: await authHeader(),
    };
    const dataStore = useDataStore()
    return fetch(`/api/data/packsQuiz?` + new URLSearchParams(payload), requestOptions)
        .then(handleResponse)
        .then(resp => {
            dataStore.setPacksQuiz(resp)
            return resp;
        });
}
async function getRoom(payload) {
    const requestOptions = {
        method: 'Get',
        headers: await authHeader(),
    };
    return fetch(`/api/data/room?` + new URLSearchParams(payload), requestOptions)
        .then(handleResponse)
        .then(resp => {
            return resp;
        });
}

async function getRooms(payload) {
    const requestOptions = {
        method: 'Get',
        headers: await authHeader(),
    };
    const dataStore = useDataStore()
    return fetch(`/api/data/rooms?` + new URLSearchParams(payload), requestOptions)
        .then(handleResponse)
        .then(resp => {
            dataStore.setRooms(resp)
            return resp;
        });
}
