import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle'
export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.vueApp.use(Toast, {
        transition: "Vue-Toastification__bounce",
        maxToasts: 3,
        newestOnTop: true,
        position: "top-right",
        timeout: 2000,
        closeOnClick: true,
        pauseOnFocusLoss: true,
        pauseOnHover: false,
        draggable: true,
        draggablePercent: 0.7,
        showCloseButtonOnHover: false,
        hideProgressBar: false,
        closeButton: "button",
        icon: true,
        rtl: false,
    });
    nuxtApp.provide('bootstrap', bootstrap)
  })