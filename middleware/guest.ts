import Cookie from 'cookie'

export default defineNuxtRouteMiddleware((to, from) => {
    let cookies: any
    if (import.meta.server) {
        
       let headers = useRequestHeaders(['cookie'])
       var cookieAll = headers.cookie ? Cookie.parse(headers.cookie) : {}
       cookies = cookieAll.user ? JSON.parse(cookieAll.user) : {}
        
    } else {
        let userStore = useUserStore()
        cookies = {user: userStore.user}
    }
    
    if (cookies && cookies.user && cookies.user.token) {
        return navigateTo('/');
    }
})