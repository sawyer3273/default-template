// only server use!!!

export const yandexService = {
    getYandexUser,
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
            if (!response.ok) {
                return ''
            } else {
                return true
            }
        })
    });
}


