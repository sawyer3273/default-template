import { io } from "socket.io-client";
const useSocketIO = () => {
    const config = useRuntimeConfig()
    const socket = io( config.public.SOCKET_URL ? (config.public.SOCKET_URL.replace('http', 'ws')) : "ws://localhost:3000" , {
       
    })
    return {
        socket,
    }
}
export default useSocketIO