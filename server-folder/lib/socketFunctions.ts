import type { Server } from "socket.io";
import prisma from "~/tools/prisma";
import { sortTable } from "~/utils/common";

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
        console.log('inRoom',inRoom)
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
    let tableData: any = await updateTable({id}, true)
    let result: any = tableData.roomUsers
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


    let questions = await prisma.quizPackRound.findMany({where: {pack_id: room.pack_id, number: {gt: 0}}, include: {answer: true}, orderBy: [{position: 'asc'}]})
    let question = questions[questionNumber - 1]
    if  (question) {
      await prisma.room.update({
        where:  { id: room.id },    data: {isFinished: false, isActive: true, question: questionNumber, timeStarted: new Date().getTime()/1000}
      })
      io.to(room.token).emit('setQuestion', questionNumber, question);
      setTimeout(async () => {
        io.to(room.token).emit('finishSlide');
      }, (question.slideTime ? question.slideTime : 1) * 1000)
      setTimeout(async () => {
        let tableData: any = await updateTable(room)
        io.to(room.token).emit('finishQuestion', tableData.roomUsers, tableData.stats);
        setQuestionAnswer(io, room, question)
      }, (question.time + (question.slideTime ? question.slideTime : 1)) * 1000)
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
    if (question.abcd) {
      question.answer = {word: question.abcd.split(',')[0]}
    }
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



export const updateTable = async (roomData: any, onlyGet = false) => {
  let room:any = await prisma.room.findFirst({where: {id: roomData.id}})
  let roomUsers: any = await prisma.roomUsers.findMany({where : {room_id: room.id}, orderBy: [{id: 'desc'}], include: {user: true}})
  let grobValue = 0
  let scoresRound = []
  if (!onlyGet && roomUsers.length) {
    scoresRound = await prisma.quizPackAnswer.findMany({where : {room_id: room.id, number: room.question, isCorrect: true}, select: {isCorrect: true}})
    grobValue =  1 - scoresRound.length  / roomUsers.length 
  }
 
  if (!onlyGet) {
    for (let i = 0; i < roomUsers.length; i++) {
      let user = roomUsers[i]
      let scores = await prisma.quizPackAnswer.findMany({where : {room_id: room.id, user_id: user.user_id}, orderBy: [{score: 'desc'}], include: {user: true}})
      let currentScore = scores.find(one => one.number == room.question)
      let grobUserValue = 0
      let grobUserValueCount = 0
      if (currentScore) {
        if (currentScore.isCorrect) {
          grobUserValue = grobValue
          grobUserValueCount++
        }
        await prisma.quizPackAnswer.update({where: {id: currentScore.id }, data: {grobValue : currentScore.isCorrect ? grobValue : -1}})
      }
      let result = 0
      scores.map(one => {
        if (one.number != room.question && one.grobValue > -1) {
          grobUserValue = grobUserValue + one.grobValue
          grobUserValueCount++
        }
        result = result + one.score
      })
      await prisma.roomUsers.update({where: {id: user.id}, data: {score: result, answerType: 0, grobValue: grobUserValueCount ? (grobUserValue / grobUserValueCount) : -1 }})
    }
  }
  let roomUsersNew:any = await prisma.roomUsers.findMany({where : {room_id: room.id}, include: {user: true}})
  roomUsersNew.sort(sortTable)

  roomUsersNew.map((one: any, i: number) => {
    let old = roomUsers.find((o:any) => o.id == one.id)
    old.change = one.score - old.score    
    old.score = one.score 
    old.position = i + 1
    old.grobValue = one.grobValue 
    old.grobValueChange = one.grobValue - old.grobValue  
  })
  console.log('roomUsers',roomUsers)
  return {roomUsers, stats: {grobValue, total:roomUsers.length, correct: scoresRound.length}} 
}

export const answerQuiz = async (io: Server, answer: any, room: any, user_id: any, question: any, newScore: any, type: any, betSize: any) => {
  try {
    let roomUser: any = await prisma.roomUsers.findFirst({where : {room_id: room.id, user_id: user_id}})
    if (roomUser) {
      let QuizPackAnswer: any = await prisma.quizPackAnswer.findFirst({where : {room_id: room.id, user_id: user_id, number: question.number}})
      let isExist: any = await prisma.quizPackAnswer.findFirst({where : {room_id: room.id, number: question.number}})
      let isCorrect = question.answer_id == answer.id 
      if (type == 'abcd') {
        let correct = question.abcd.split(',')[0]
        isCorrect = correct == answer.text
      }
      if (type == 'manyAnswersChoose') {
        let correct = question.manyAnswers
        let res = correct.split(',')
        let res2 = answer.text.split(',')
        newScore = 0 
        isCorrect = true
        question.score = 0
        res.map((one: any, i: number) => {
            if (i % 2 == 0) {
            } else {
                if (one == 'true' && res2[i] == 'true') {
                  newScore = newScore + 1
                }
                if (one == 'false' && res2[i] == 'true') {
                  isCorrect = false
                }
            }
        })
      }
      
      if (type == 'order') {
        let res = question.order.split(',')
        let correctData: any = []
        res.map((one: any, i: number) => {
            if (i % 2 == 0) {
              correctData.push(one)
            } 
        })
        let res2 = answer.text.split(',')
        newScore = 0
        isCorrect = true
        res2.map((one: any, i: number) => {
            if (correctData[i] != one) {
              isCorrect = false
            }
        })
      }
      if (type == 'comparison') {
        let correct = question.comparison
        let res = question.comparison.split(',')
        if (res.length > 4) {
          let correctData: any = []
          res.map((one: any, i: number) => {
              if (i % 2 == 0) {
              } else {
                  correctData.push(one)
              }
          })
          let res2 = answer.text.split(',')
          newScore = 0
          let j = 0
          res2.map((one: any, i: number) => {
              if (i % 2 == 0) {
              } else {
                if (correctData[j] == one) {
                  isCorrect = true
                  newScore = newScore + 0.25
                }
                j++
              }
          })
        } else {
          isCorrect = correct == answer.text
        }
      }
      let score = isCorrect ? (newScore ? newScore : question.score) : 0
      if (question.isSlideBtn) {
        score = isCorrect ? betSize : 0 - betSize
      }
      let total = roomUser.score + score
      let data: any = {
        room_id: room.id, 
        pack_id: room.pack_id, 
        user_id: user_id, 
        number: question.number,
        textAnswer: answer.text ? answer.text : '',
        isCorrect: isCorrect,
        score: score,
        total: total,
        isFirst: isExist ? false: true
      }
      if (answer.id) {
        data.answer_id = answer.id
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
