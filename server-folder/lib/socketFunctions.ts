import type { Server } from "socket.io";
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
        let data: any = {
          user_id: userToken.user_id,
          room_id: room.id,
          pack_id: room.pack_id,
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
              let isExist = await prisma.roomUsers.findFirst({
                where: {user_id: userToken.user_id, pack_id: room.pack_id, isFinished: true}
              })
              if (isExist) {
                data.isAlreadyPassed = true
                data.alreadyScore = isExist.score
              }
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


export const removeFromRoom = async (payload: any = {}, io: Server) => {
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
          io.to('quizeslist').emit('updateQuizlist');
          await prisma.roomUsers.delete({
            where:  {
              id: roomUser.id
            }
          })
        } else if (room && room.isActive) {
          await prisma.roomUsers.update({
            where:  {
              id: roomUser.id
            }, data: {isReady: false}
          })
        } else {
          io.to('quizeslist').emit('updateQuizlist');
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
          if (room && !room.isActive) {
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
          room: room ? room.token : ''
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
        score: 'desc'
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
    await prisma.roomUsers.updateMany({
      where:  {
        room_id: room_id
      }, 
      data: {pack_id: id}
    })
    let quiz = await prisma.quizPack.findFirst({
      where:  {
        id: id,
      },
      include: {QuizPackRound: true },
    })
    return {
      success: true,
      data: quiz,
      roomUsers: await getRoom(room_id)
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

export const roomStatusQuiz = async (io: Server, room: any) => {
  try {
    setQuestion(io, room, 1)
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

const setQuestion = async (io: Server, roomData: any, questionNumber: any) => {
  try {
    let room: any = await prisma.room.findFirst({where : {id: roomData.id}})
    if (!room) {
      return {success: false}
    }


    let questions = await prisma.quizPackRound.findMany({where: {pack_id: room.pack_id}, include: {answer: true}})
    let question = questions[questionNumber - 1]
    if  (question) {
      await prisma.room.update({
        where:  { id: room.id },    data: {isFinished: false, isActive: true, question: questionNumber, timeStarted: new Date().getTime()/1000}
      })
      io.to(room.token).emit('setQuestion', questionNumber, question);
      setTimeout(async () => {
        io.to(room.token).emit('finishSlide');
      }, (question.slideTime) * 1000)
      setTimeout(async () => {
        let roomUsers = await updateTable(room)
        io.to(room.token).emit('finishQuestion', roomUsers);
        setQuestionAnswer(io, room, question)
      }, (question.time + question.slideTime) * 1000)
    } else {
      await prisma.room.update({
        where:  { id: room.id },    data: {isFinished: true, timeStarted: 0}
      })
      await prisma.roomUsers.updateMany({
        where:  { room_id: room.id },    data: {isFinished: true}
      })
      io.to(room.token).emit('finishAll', room);
    }
    
    
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

const setQuestionAnswer = async (io: Server, room: any, question: any) => {
  try {
    io.to(room.token).emit('showAnswer', question);
    setTimeout(async () => {
      setQuestion(io, room, question.number + 1)
    }, 5000)
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



export const updateTable = async (room: any) => {
  let roomUsers: any = await prisma.roomUsers.findMany({where : {room_id: room.id}, orderBy: [{score: 'desc'}], include: {user: true}})
  for (let i = 0; i < roomUsers.length; i++) {
    let user = roomUsers[i]
    let scores = await prisma.quizPackAnswer.findMany({where : {room_id: room.id, user_id: user.user_id, isCorrect: true}, orderBy: [{score: 'desc'}], include: {user: true}})
    let result = 0
    scores.map(one => result = result + one.score)
    await prisma.roomUsers.update({where: {id: user.id}, data: {score: result, answerType: 0}})
  }
  roomUsers = await prisma.roomUsers.findMany({where : {room_id: room.id}, orderBy: [{score: 'desc'}], include: {user: true}})
  return roomUsers
}

export const answerQuiz = async (io: Server, answer: any, room: any, user_id: any, question: any, newScore: any) => {
  try {
    let roomUser: any = await prisma.roomUsers.findFirst({where : {room_id: room.id, user_id: user_id}})
    if (roomUser) {
      let QuizPackAnswer: any = await prisma.quizPackAnswer.findFirst({where : {room_id: room.id, user_id: user_id, number: question.number}})
      let isExist: any = await prisma.quizPackAnswer.findFirst({where : {room_id: room.id, number: question.number}})
      let isCorrect = question.answer_id == answer.id 
      let score = isCorrect ? (newScore ? newScore : question.score) : 0
      let total = roomUser.score + score
      let data = {
        room_id: room.id, 
        pack_id: room.pack_id, 
        user_id: user_id, 
        number: question.number,
        answer_id: answer.id,
        textAnswer: answer.text ? answer.text : '',
        isCorrect: isCorrect,
        score: score,
        total: total,
        isFirst: isExist ? false: true
      }
      if (QuizPackAnswer) {
        await prisma.quizPackAnswer.update({where: {id: QuizPackAnswer.id}, data})
      } else {
        await prisma.quizPackAnswer.create({data})
      }
      let answerType = isExist ? 1 : 2
      await prisma.roomUsers.update({where: {id: roomUser.id}, data: {answerType}})
      io.to(room.token).emit('userAnswered', roomUser, answerType);
    } 

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
