import Cookie from 'cookie'

export default defineNuxtRouteMiddleware((to, from) => {
    let cookies
    if (import.meta.server) {
        let headers = useRequestHeaders(['cookie'])
        var cookieAll = headers.cookie ? Cookie.parse(headers.cookie) : {}
        cookies = cookieAll.main ? JSON.parse(cookieAll.main) : {}
        
    } else {
        cookies = localStorage.getItem('user')
        if (cookies) {
            cookies = {user: JSON.parse(JSON.parse(cookies).value)}
        }
    }
    
    if (cookies && cookies.user && cookies.user.token) {
        return navigateTo('/');
    }
})