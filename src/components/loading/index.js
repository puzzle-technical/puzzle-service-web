import './index.css'
import Logo from '../../assets/img/logo.png'

export default function Loading (props) {
  const { color, size = 40, stroke = size * 0.035, withLogo } = props

  return <div className="loading-wrapper">
    {withLogo ?
    <div className="with-logo">
      <div className="loading-logo">
        <img src={Logo} height={size*0.7/2} alt="logo"></img>
      </div>
      <svg className="loading" width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={size/2 - stroke - 1} stroke={color} strokeWidth={stroke < 4 ? 4 : stroke} fill="none" strokeDasharray={`${(size)*3*.7},1000`} />
      </svg>  
    </div> :
    <svg className="loading" width={size} height={size}>
      <circle cx={size/2} cy={size/2} r={size/2 - stroke - 1} stroke={color} strokeWidth={stroke < 4 ? 4 : stroke} fill="none" strokeDasharray={`${(size)*3*.7},1000`} />
    </svg>}
  </div>
}