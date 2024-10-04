import prisma from "~/tools/prisma";

export const addToRoom = async (payload: any = {}, io: any) => {
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
          socket_id: payload.socket_id,
          isAdmin: room.entity_id == userToken.user_id,
          isActive: room.isActive ? true: false,
          isReady: room.isActive ? true: false,
        }
        let whereData: any = {
          user_id: userToken.user_id,
          room_id: room.id
        }

        if (!room.isActive) {
          whereData.socket_id = payload.socket_id
        }
        let result = await prisma.roomUsers.findFirst({
          where: whereData,
        })
        io.to('quizeslist').emit('updateQuizlist');
        if (!room.isActive) {
          if (!result) {
              result = await prisma.roomUsers.create({
                data,
              })
          } else {
              await prisma.roomUsers.updateMany({
                where: whereData,
                data,
              })
          }
        } else {
          await prisma.roomUsers.updateMany({
            where: whereData,
            data,
          })
        }
        let inRoom = await getRoom(room.id)
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
          success: false, room, userToken
        }
      }
    } catch (err) {
      console.log('err',err)
      return {
        success: false
      }
    }
};


export const removeFromRoom = async (payload: any = {}, io: any) => {
  try {
    if (payload.socket_id) {
      let roomUser = await prisma.roomUsers.findFirst({
          where:  {
            socket_id: payload.socket_id,
          }
        })
       
      if (roomUser) {
        let room = await prisma.room.findFirst({
          where:  {
            id: roomUser.room_id,
          }
        })
        if (!roomUser.isActive) {
          await prisma.roomUsers.delete({
            where:  {
              id: roomUser.id
            }
          })
        } else if (room.isActive) {
          await prisma.roomUsers.update({
            where:  {
              id: roomUser.id
            }, data: {isReady: false}
          })
        } else {
          await prisma.roomUsers.delete({
            where:  {
              id: roomUser.id
            }
          })
        }
        let inRoom = await getRoom(roomUser.room_id)
        inRoom = inRoom.filter((obj1: any, i: any, arr: any) => 
          arr.findIndex((obj2: any) => (obj2.user_id === obj1.user_id)) === i
        )
        if (!inRoom.length) {
          if (!room.isActive) {
            await prisma.room.delete({
              where:  {
                id: roomUser.room_id
              }
            })
            io.to('quizeslist').emit('updateQuizlist');
          }
        } else {
          if (roomUser.isAdmin) {
            await prisma.roomUsers.update({
              where:  {
                id: inRoom[0].id,
              },
              data: {isAdmin: true}
            })
            inRoom[0].isAdmin = true
          }
        }
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


export const getRoom = async (id: any, filter = false) => {
  try {
    let result =  await prisma.roomUsers.findMany({
      include: {user: {select: {
        id: true, email: true, username: true
      }}},
      where:  {
        room_id: id,
      },
      orderBy: [{
        id: 'asc'
      }]
    })
    if (filter) {
      result = result.filter((obj1: any, i: any, arr: any) => 
        arr.findIndex((obj2: any) => (obj2.user_id === obj1.user_id)) === i
      )
    }
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
      let find = clients.includes(inRoom[index].socket_id) || inRoom[index].isActive
      if (!find) {
        await prisma.roomUsers.deleteMany({
          where:  {
            id: inRoom[index].id,
            isActive: false
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

export const changeUserStatusInRoom = async (room_id: any, user_id: any, status: boolean = true, field = 'isActive') => {
  try {
    await prisma.roomUsers.updateMany({
      where:  {
        room_id,
        user_id
      }, 
      data: {[field]: status}
    })
    return {
      success: false,
      data: await getRoom(room_id, true)
    }
  } catch (err) {
    console.log('err',err)
    return  {
      success: false,
      data: []
    }
  }
};

export const roomChoosePack = async (id: any, room_id: any) => {
  try {
    await prisma.room.update({
      where:  {
        id: room_id
      }, 
      data: {pack_id: id}
    })
    let quiz = await prisma.quizPack.findFirst({
      where:  {
        id: id,
      },
      include: {QuizPackRound: true },
    })
    console.log('quiz',quiz)
    return {
      success: true,
      data: quiz
    }
  } catch (err) {
    console.log('err',err)
    return  {
      success: false,
      data: []
    }
  }
};
export const roomStatusQuiz = async (room: any) => {
  try {
    await prisma.room.update({
      where:  {
        id: room.id
      }, 
      data: {isActive: true, question: 1}
    })
    
    return {
      success: true,
    }
  } catch (err) {
    console.log('err',err)
    return  {
      success: false,
      data: []
    }
  }
};
export const changeRoomName = async (room: any, name: string) => {
  try {
    await prisma.room.update({
      where:  {
        id: room.id
      }, 
      data: {name}
    })
    
    return {
      success: true,
    }
  } catch (err) {
    console.log('err',err)
    return  {
      success: false,
      data: []
    }
  }
};
