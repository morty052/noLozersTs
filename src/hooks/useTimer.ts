import { useEffect, useState } from "react";


const useTimer = (cb) => {
    const timer = new Promise((resolve, reject) => {
       setTimeout(() => {
           resolve("Time is up")
       }, 30000);
    })   
  
    const input = (text) =>  new Promise((resolve, reject) => {
       console.log("awaiting Input")
       if (text) {
         resolve("input received")  
       }
    })
  
    const [time, setTime] = useState(30)
    const [finished, setfinished] = useState(false)
  
    useEffect(() => {
  
      
  const dec = () => setTimeout(() => {
  
    
  
      if (time === 0) {
        cb()
        // restart timer *31 seconds because it somehow starts at 29 with 30
        setTime(31)

         
      }

      console.log("decreased")
       setTime((prev) => prev - 1)
      }, 1000);
    
      dec()
  
      return () => {
       clearTimeout(dec)
      }
      
    }, [time])
  
    return {time,timer, input, setTime,}
    
  }

const Backup = ( count, setTimeUp ) => {

    const [time, setTime] = useState(count)

    // @params COUNT: TIME TO DISPLAY
    // @params seTimeUp: FUNCTION TO END TIMER

    // FUNCTION TO DECREASE TIME
    const decreaseTime = () => {
        
        // SET TIME UP VARIABLE TO END ROUND
        if (time == 0) {
            return
            // return setTimeUp(true)
        }

        //  DECREASE TIME BY ONE SECOND EVERY SECOND
        setTimeout(() => {
           setTime((prev) => prev -1) 
        }, 1000);
    }

    // FUNCTION TO RETURN PROMISE ON TIME UP

   // CALL DECREASE TIME FUNCTION ON MOUNT
    useEffect(() => {
    
        decreaseTime()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [time])

    return {time}
}

export default useTimer