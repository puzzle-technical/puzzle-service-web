import './index.css'

import { ReactComponent as Star } from '../../assets/icons/star.svg'
import { useEffect } from 'react'
import api from '../../api'
import { useState } from 'react'

const StarsComponent = (props) => {
  const { defaultValue, maxValue = 5, size = 15, count, onEvaluate } = props

  const [value, setValue] = useState(defaultValue)

  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

  const evaluate = (value) => {
    if (typeof onEvaluate != 'function') return

    setValue(value)
    onEvaluate(value)
  }

  const star = (value, index) => {
    let width = `${Number.parseInt(value * 100)}%`

    return <div className={`star ${typeof onEvaluate == 'function' && 'clickable'}`} key={index} style={{ width: size, height: size, margin: size * 0.15 }} onClick={() => { evaluate(index + 1) }}>
      <Star className="star-backlayer"  color={'#FFFFFF'} width={size} height={size} stroke="#3a3a3a" strokeWidth={20}></Star>
      <div className="star-mask" style={{ width }}>
        <Star className="star-frontlayer" color={'#FFDE5B'} width={size} height={size} stroke="#3a3a3a" strokeWidth={20}></Star>
      </div>
    </div>
  }

  const calculate = () => {
    if (!value) return [...Array(maxValue)]

    let values = []
    for (let i = 1; i <= maxValue; i++) {
      if (value >= i ) values.push(1)
      else values.push(value - (i-1) < 0 ? 0 : value - (i-1))      
    }
    // console.log('calculate', values)
    return values
  }

  const title = (value, count) => {
    return `${value ? Number(value).toFixed(2) : ''} ${value && count ? '|' : '' } ${count ? `${count} avaliações` : '0 avaliações'}`
  }

  return <div className="stars-wrapper" title={typeof onEvaluate == 'function' ? '' : title(value, count) }>
    {calculate().map((value, index) => {
        return star(value, index)
      })}
  </div>
}


export default function Stars (props) {
  const { idRatedUser, onEvaluate } = props 
  
  const [value, setvalue] = useState(0)
  const [count, setcount] = useState(0)

  useEffect(() => {
    const loadRating = () => {
      api.get(`/users/getRating/${idRatedUser}`)
      .then(res => {
        console.log(res.data);
        if (res.data.success) {
          let { average, count } = res.data.data
          setvalue(average)
          setcount(count)
        }
      })
      .catch(err => {
        console.log(err)
      })
    }
    loadRating()
    return () => {}
  }, [])
  
  return <StarsComponent defaultValue={value} count={count} onEvaluate={onEvaluate}/>
}