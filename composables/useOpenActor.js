import { ref, customRef,  } from 'vue'

const useOpenActor = (actors, className, classI, show, emit, disabled) => {
  return function open(i, decrement = true) {
    if (decrement) {
      emit('chooseData', actors.value[i])
    }
    if (!show.value.includes(i)) {
        className.value = 'elementOpen'
        classI.value.push(i)
        setTimeout(() => {
            className.value = ''
            var index = classI.value.indexOf(i);
            if (index !== -1) {
              classI.value.splice(index, 1);
            }
        }, 1000)
        disabled.value.push(i)
        setTimeout(() => {
           show.value.push(i)
        }, 500)
    }
  }
}
export default useOpenActor