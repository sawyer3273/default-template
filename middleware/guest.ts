import { useMainStore } from '@/stores/main'
const router = useRouter()
export default defineNuxtRouteMiddleware((to, from) => {
    const mainStore = useMainStore()
    if (!mainStore.user.token && !import.meta.server) {
        return navigateTo('/');
    }
})