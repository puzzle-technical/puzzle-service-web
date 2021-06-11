import { useState } from "react"
import Stars from '../stars'

export default function Evaluation (props) {
  const { idRatedUser, idEvaluatorUser, onEvaluate } = props

  const [alreadyRated, setAlreadyRated] = useState()
  const [value, setValue] = useState(0)
  const labels = ['Péssimo', 'Ruim', 'Regular', 'Bom', 'Excelente']

  const evaluate = (value) => {
    if (typeof onEvaluate != 'function') return

    setValue(value)
    onEvaluate(value)
  }

  return <div>
    <p>Avalie este usuário com uma nota de 1 a 5.</p>
    <Stars idRatedUser={idRatedUser} onEvaluate={evaluate}/>
    <p>{value > 0 ? labels[value - 1] : ' '}</p>
  </div>
}