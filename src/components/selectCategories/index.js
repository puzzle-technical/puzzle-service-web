import './index.css'

import { useState } from 'react'
import Select from 'react-select'
import Button from '../button'

export default function SelectCategories (props) {
  const { categories, onSearch } = props
  const [selectedCategories, setSelectedCategories] = useState([])

  const handleChange = values => {
    setSelectedCategories(values)
  }

  return <div className="select-categories">
    <Select
      placeholder="Selecione uma ou mais categorias"
      defaultValue={[]}
      isMulti
      options={categories}
      onChange={handleChange}
      className="basic-multi-select"
      classNamePrefix="select"
    />
    <Button title="FILTRAR" onClick={() => onSearch(selectedCategories)}></Button>
  </div>
}