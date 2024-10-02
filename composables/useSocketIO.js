import { io } from "socket.io-client";
const useSocketIO = () => {
    const socket = io('ws://localhost:3000')
    return {
        socket,
    }
}
export default useSocketIO