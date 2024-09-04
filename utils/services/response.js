import { useToast } from "vue-toastification";
import { ERROR_EXPIRED } from "~/constants";
import { useMainStore } from '@/stores/main'
const toast = useToast();


export function handleResponse(response) {
    return response.text().then(text => {
        const mainStore = useMainStore()
        mainStore.setLoader(false)
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (data.type == ERROR_EXPIRED) {
                
            }
            if (data.message && data.type != ERROR_EXPIRED && !data.hideFrontMessage) {
                toast.error(data.message);
            }
            if (response.status === 401) {
                // auto logout if 401 response returned from api
               // logout(); TODO
               // location.reload(true);
            }
            
            let error = (data && data.message) || response.statusText;
            if (data && data.errors && data.errors[0]) {
                error = data.errors[0].msg
            }
            return Promise.reject(error);
        } else {
            if (data.frontMessage && data.message) {
                toast.success(data.message);
            }
        }
        return data;
    });
}
