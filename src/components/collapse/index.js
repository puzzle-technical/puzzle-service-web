import './index.css'
import { useState } from 'react'
import { ReactComponent as AngleUpIcon } from '../../assets/icons/angle-up.svg';
import { ReactComponent as AngleDownIcon } from '../../assets/icons/angle-down.svg';

export default function Collapse(props) {
  const { options } = props
  const [current, setCurrent] = useState(options?.length == 1 ? 0 : 0)

  return <div className="collapse">
    <div className="collapse-options">
      {
        options.map((option, index) => {
          return <div key={index} className={`collapse-option ${current != index && 'closed'}`}>
            { current === index ?
              <div className="collapse-opened">{option.opened}</div> :
              <div className="collapse-closed" onClick={() => setCurrent(index)}>
                {option.closed}
                <button className="collapse-button">
                  <AngleDownIcon width={20}></AngleDownIcon>
                </button>
              </div>
            }
            { option.background && current != index &&
              <div className="collapse-option-bg" style={{ backgroundImage: `url(${option.background})` }}></div>
            }
          </div>
        })
      }
    </div>
  </div>
}