'use client'

import { useState, useEffect } from 'react'

export function Countdown() {
  const [time, setTime] = useState({
    days: 7,
    hours: 4,
    minutes: 55,
    seconds: 30
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prevTime => {
        const newTime = { ...prevTime }
        if (newTime.seconds > 0) {
          newTime.seconds--
        } else {
          newTime.seconds = 59
          if (newTime.minutes > 0) {
            newTime.minutes--
          } else {
            newTime.minutes = 59
            if (newTime.hours > 0) {
              newTime.hours--
            } else {
              newTime.hours = 23
              if (newTime.days > 0) {
                newTime.days--
              }
            }
          }
        }
        return newTime
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex gap-4">
      <div className="text-center">
        <div className="bg-gray-100 rounded-lg p-2 min-w-[40px]">
          <span className="text-lg font-semibold">{time.days}</span>
        </div>
        <span className="text-xs text-gray-600">Days</span>
      </div>
      <div className="text-center">
        <div className="bg-gray-100 rounded-lg p-2 min-w-[40px]">
          <span className="text-lg font-semibold">{time.hours}</span>
        </div>
        <span className="text-xs text-gray-600">Hrs</span>
      </div>
      <div className="text-center">
        <div className="bg-gray-100 rounded-lg p-2 min-w-[40px]">
          <span className="text-lg font-semibold">{time.minutes}</span>
        </div>
        <span className="text-xs text-gray-600">Min</span>
      </div>
      <div className="text-center">
        <div className="bg-gray-100 rounded-lg p-2 min-w-[40px]">
          <span className="text-lg font-semibold">{time.seconds}</span>
        </div>
        <span className="text-xs text-gray-600">Sec</span>
      </div>
    </div>
  )
}

