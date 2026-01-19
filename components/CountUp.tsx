'use client'
import { useEffect, useState } from 'react'

export default function CountUp({ to=1000, duration=1500, prefix='', suffix='' }:{to?:number, duration?:number, prefix?:string, suffix?:string}){
  const [val, setVal] = useState(0)
  useEffect(()=>{
    const start = performance.now()
    const step = (t:number)=>{
      const p = Math.min(1, (t-start)/duration)
      setVal(Math.round(to * (0.5 - Math.cos(Math.PI*p)/2)))
      if(p<1) requestAnimationFrame(step)
    }
    const r = requestAnimationFrame(step)
    return ()=> cancelAnimationFrame(r)
  }, [to, duration])
  return <span>{prefix}{val.toLocaleString()}{suffix}</span>
}
