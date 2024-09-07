import Cookie from 'cookie'

export default defineNuxtRouteMiddleware((to, from) => {
    if (import.meta.server) {
        let headers = useRequestHeaders(['cookie'])
        var cookieAll = headers.cookie ? Cookie.parse(headers.cookie) : {}
        var cookies = cookieAll.main ? JSON.parse(cookieAll.main) : {}

        if (cookies.user.token) {
            return navigateTo('/');
        }
    }
})