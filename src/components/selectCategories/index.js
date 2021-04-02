import './index.css'

import Select from 'react-select'
import Button from '../button'

export default function SelectCategories (props) {
  const { selectedCategories, categories, onSearch, onSelectCategories } = props

  const handleChange = values => {
    onSelectCategories(values)
  }

  return <div className="select-categories">
    <Select
      placeholder="Selecione uma ou mais categorias"
      value={selectedCategories}
      isMulti
      options={categories}
      onChange={handleChange}
      className="basic-multi-select"
      classNamePrefix="select"
    />
    <Button title="BUSCAR PROFISSIONAIS" onClick={() => onSearch()}></Button>
  </div>
}