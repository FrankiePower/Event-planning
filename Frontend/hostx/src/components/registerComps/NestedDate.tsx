import { useEffect, useState } from "react"

const NestedDate = ({
    startTime,
    endTime
}:{
    startTime:string,
    endTime:string
}) => {
  const [month, setMonth] = useState<string>("")
  const [point, setPoint] = useState<string>("")

  const getMyMonth = () => {
    let breakDown = startTime.split(",")[0];
    breakDown.split("/")[0];

    const breakDown2 =breakDown.split("/")[0]

    console.log("break down ", breakDown.split("/")[0])

    setPoint(breakDown2)

    const pin = breakDown2 === "1" ? "Jan" :
    breakDown2 === "2" ? "Feb" : 
    breakDown2 === "3" ? "Mar" :
    breakDown2 === "4" ? "Apr" :
    breakDown2 === "5" ? "May" :
    breakDown2 === "6" ? "Jun" :
    breakDown2 === "7" ? "Jul" :
    breakDown2 === "8" ? "Aug" :
    breakDown2 === "9" ? "Sep" :
    breakDown2 === "10" ? "Oct" :
    breakDown2 === "11" ? "Nov" : "Dec";

    setMonth(pin);
  }

  useEffect(() => {
    getMyMonth()
  }, [startTime, endTime])

  return (
    <div
        className='flex flex-row items-center mb-2'
    >
        <div
            className='mr-8'
        >
            <p
                className='text-xs font-regular text-[#f7f5f2]'
            >
                {month}
            </p>

            <p
                className='text-md font-regular text-[#f7f5f2]'
            >
                {point}
            </p>
        </div>

        <div>
            <p
                className='font-bold text-white'
            >
                {startTime.split(",")[0]} - {endTime.split(",")[0]}
            </p>

            <p
                className='font-regular text-[#f7f5f2]'
            >
                {startTime.split(",")[1]} - {endTime.split(",")[1]}
            </p>
        </div>
    </div>
  )
}

export default NestedDate