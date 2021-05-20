import './index.scss'
import { ReactComponent as Star } from '../../assets/icons/star.svg'
import Tooltip from '../tooltip'

export default function Rating(props) {
  const { value, maxValue = 5, size = 20, evaluations } = props

  const star = (value, index) => {
    let width = `${Number.parseInt(value * 100)}%`

    return <div className="star" key={index} style={{ width: size, height: size, margin: size * 0.15 }}>
      <Star className="star-backlayer"  color={'#FFFFFF'} width={size} height={size} stroke="#3a3a3a" strokeWidth={20}></Star>
      <div className="star-mask" style={{ width }}>
        <Star className="star-frontlayer" color={'#FFDE5B'} width={size} height={size} stroke="#3a3a3a" strokeWidth={20}></Star>
      </div>
    </div>
  }

  const calculate = () => {
    if (!value) return []

    let values = []
    for (let i = 1; i <= maxValue; i++) {
      if (value >= i ) values.push(1)
      else values.push(value - (i-1))      
    }
    return values
  }

  return <div className="rating is-relative">
    <div className="is-flex">
      {calculate().map((value, index) => {
        return star(value, index)
      })}
    </div>
    <Tooltip justifyContent="center">
      <p className="tag is-medium has-shadow">
        <span>{value ? Number(value).toFixed(2) : ''}</span>
        {value && evaluations ? <span className="mx-2">/</span> : ''}
        <span>{evaluations ? `${evaluations} avaliações` : ''}</span>
      </p>
    </Tooltip>
  </div>
}