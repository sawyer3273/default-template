import { io } from "socket.io-client";
const useSocketIO = () => {
    const config = useRuntimeConfig()
    const socket = io('ws://localhost:' + (config.public.SOCKET_PORT), {
       
    })
    return {
        socket,
    }
}
export default useSocketIO