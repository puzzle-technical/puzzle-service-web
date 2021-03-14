import './index.css'

export default function Loading (props) {
  const { color, size = 40 } = props

  return <svg className="loading" width={size} height={size}>
    <circle cx={size/2} cy={size/2} r={size/2 - 2} stroke={color} strokeWidth="4" fill="none" strokeDasharray={`${(size)*3*.7},1000`} />
  </svg>
}