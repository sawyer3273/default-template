import prisma from "~/tools/prisma";

export const addToRoom = async (payload: any = {}) => {
    try {
      let room = await prisma.room.findFirst({
        where: {
          token: payload.room_token,
        }
      })
      let userToken = await prisma.userAuthTokens.findFirst({
        where: {
          accessToken: payload.user_token,
        }
      })
      if (room && userToken) {
        let data = {
          user_id: userToken.user_id,
          room_id: room.id,
          socket_id: payload.socket_id
        }
        let whereData = {
          user_id: userToken.user_id,
          room_id: room.id,
          socket_id: payload.socket_id
        }
        let result = await prisma.roomUsers.findFirst({
          where: whereData,
        })
        if (!result) {
            result = await prisma.roomUsers.create({
              data,
            })
        } else {
            result = await prisma.roomUsers.updateMany({
              where: whereData,
              data,
            })
        }
        let inRoom = await getRoom(result.room_id)
        if (inRoom.length !== payload.clients.length) {
          inRoom = await deleteOldInRoom(inRoom, payload.clients)
        }
        inRoom = inRoom.filter((obj1: any, i: any, arr: any) => 
          arr.findIndex((obj2: any) => (obj2.user_id === obj1.user_id)) === i
        )
        return {
          success: true, 
          data: inRoom
        }
      } else {
        return {
          success: false
        }
      }
    } catch (err) {
      console.log('err',err)
      return {
        success: false
      }
    }
};


export const removeFromRoom = async (payload: any = {}) => {
  try {
    console.log('payload',payload)
    if (payload.socket_id) {
      let roomUser = await prisma.roomUsers.findFirst({
          where:  {
            socket_id: payload.socket_id,
          }
        })
       
      if (roomUser) {
        await prisma.roomUsers.delete({
          where:  {
            id: roomUser.id
          }
        })
        let room = await prisma.room.findFirst({
          where:  {
            id: roomUser.room_id,
          }
        })
        let inRoom = await getRoom(roomUser.room_id)
        inRoom = inRoom.filter((obj1: any, i: any, arr: any) => 
          arr.findIndex((obj2: any) => (obj2.user_id === obj1.user_id)) === i
        )
        return {
          success: true,
          data: inRoom,
          room: room.token
        }
      }
      
      return {
        success: false,
        data: []
      }
    } else {
      return {
        success: false,
        data: [],
      }
    }
  } catch (err) {
    console.log('err',err)
    return {
      success: false,
      data: []
    }
  }
};


export const getRoom = async (id: any) => {
  try {
    let result =  await prisma.roomUsers.findMany({
      include: {user: {select: {
        id: true, email: true, username: true
      }}},
      where:  {
        room_id: id,
      }
    })
    
    return result
  } catch (err) {
    console.log('err',err)
    return  []
  }
};

export const deleteOldInRoom = async (inRoom: any, clients: any) => {
  try {
    let result = []
    for (let index in inRoom) {
      let find = clients.includes(inRoom[index].socket_id)
      if (!find) {
        await prisma.roomUsers.delete({
          where:  {
            id: inRoom[index].id
          }
        })
      } else {
        result.push(inRoom[index])
      }
    }
    return result
  } catch (err) {
    console.log('err',err)
    return  []
  }
};