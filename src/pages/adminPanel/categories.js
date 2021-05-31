import './index.css'
import { useState, useEffect } from 'react'
import api from '../../api'
import Table from '../../components/table'
import Modal from '../../components/modal'

export default function AdminPanel () {
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])

  const [showModal, setShowModal] = useState()
  const [modalInfo, setModalInfo] = useState({})

  const displayAlert = (content, title = 'Atenção', onConfirmation) => {
    setModalInfo({ title, content, onConfirmation })
    setShowModal(true)
    return
  }

  const createCategory = () => {
    let nome, image
    let setNome = n => nome = n
    let setImage = i => image = i
    const form = <div>
      <p>Nome</p>
      <input className="input-simple" onInput={e => setNome(e.target.value)}></input>
      <p>Image</p>
      <input className="input-simple" onInput={e => setImage(e.target.value)}></input>
    </div>

    displayAlert(form, 'Nova categoria', async () => {
      if (!nome) return displayAlert('Nome da categoria é necessário')
      await api.post(`categories/create`, { nome, image })
      .then(res => {
        displayAlert(res.data.feedback, '', () => window.location.reload())
      })
      .catch(err => {
        displayAlert(err)
      })
    })
  }


  const editCategory = (category) => {
    let { nome, image } = category
    let setNome = n => nome = n
    let setImage = i => image = i
    const form = <div>
      <p>Nome</p>
      <input className="input-simple" defaultValue={nome} onInput={e => setNome(e.target.value)}></input>
      <p>Image</p>
      <input className="input-simple" defaultValue={image} onInput={e => setImage(e.target.value)}></input>
    </div>

    displayAlert(form, 'Editar categoria', () => {
      if (!nome) return displayAlert('Nome da categoria é necessário')
      displayAlert('Tem certeza que deseja atualizar categoria?', '', async () => {
        console.log(nome, image)
        await api.put(`categories/update/${category.idCategory}`, { nome, image })
        .then(res => {
          displayAlert(res.data.feedback, '', () => window.location.reload())
        })
        .catch(err => {
          displayAlert(err)
        })
      })
    })
  }

  const removeCategory = (category) => {
    displayAlert(`Tem certeza que deseja excluir a categoria?
    As subcategorias associadas também vão ser removidas e todas as referencias de usuários e serviços a elas serão perdidas.`, 'Remover categoria', async () => {
      await api.delete(`categories/delete/${category.idCategory}`)
      .then(res => {
        displayAlert(res.data.feedback, '', () => window.location.reload())
      })
      .catch(err => {
        displayAlert(err)
      })
    })
  }


  const createSubcategory = () => {
    let nome, idCategory = categories?.length && categories[0].idCategory
    let setNome = n => nome = n
    let setIdCategory = i => idCategory = i
    const form = <div>
      <p>Nome</p>
      <input className="input-simple" onInput={e => setNome(e.target.value)}></input>
      <p>IdCategory</p>
      <select defaultValue={idCategory} onInput={e => setIdCategory(e.target.value)}>
        {categories.map((el, i) => <option key={i} value={el.idCategory}>{el.idCategory} - {el.nome}</option>)}
      </select>
    </div>

    displayAlert(form, 'Nova subcategoria', async () => {
      if (!nome) return displayAlert('Nome da subcategoria é necessário')
      await api.post(`categories/createSubcategory`, { nome, idCategory })
      .then(res => {
        displayAlert(res.data.feedback, '', () => window.location.reload())
      })
      .catch(err => {
        displayAlert(err)
      })
    })
  }

  const editSubcategory = (subcategory, categories) => {
    console.log(categories);
    let { nome, idCategory } = subcategory
    let setNome = n => nome = n
    let setIdCategory = i => idCategory = i
    const form = <div>
      <p>Nome</p>
      <input className="input-simple" defaultValue={nome} onInput={e => setNome(e.target.value)}></input>
      <p>IdCategory</p>
      <select defaultValue={idCategory} onInput={e => setIdCategory(e.target.value)}>
        {categories.map((el, i) => <option key={i} value={el.idCategory}>{el.idCategory} - {el.nome}</option>)}
      </select>
    </div>

    displayAlert(form, 'Editar subcategoria', () => {
      if (!nome) return displayAlert('Nome da subcategoria é necessário')
      displayAlert('Tem certeza que deseja atualizar a subcategoria?', '', async () => {
        console.log(nome, idCategory)
        await api.put(`categories/updateSubcategory/${subcategory.idSubcategory}`, { nome, idCategory })
        .then(res => {
          displayAlert(res.data.feedback, '', () => window.location.reload())
        })
        .catch(err => {
          displayAlert(err)
        })
      })
    })
  }

  const removeSubcategory = (subcategory) => {
    displayAlert(`Tem certeza que deseja excluir a subcategoria?
    Todas as referencias de usuários e serviços a elas serão perdidas.`, 'Remover subcategoria', async () => {
      await api.delete(`categories/deleteSubcategory/${subcategory.idSubcategory}`)
      .then(res => {
        displayAlert(res.data.feedback, '', () => window.location.reload())
      })
      .catch(err => {
        displayAlert(err)
      })
    })
  }

  useEffect(() => {
    let load = async () => {
      await api.get('categories/getSubcategoriesGroups')
      .then(res => {
        let cat = []
        let subcat = []
        res.data.data.map(el => {
          subcat = [...subcat, ...el.subcategories]
          delete el.subcategories
          let category = el
          category = {" ": <div>
            <button className="table-button" onClick={() => editCategory(el)}>Editar</button>
            <button className="table-button" onClick={() => removeCategory(el)}>Excluir</button>
          </div>, ...el}
          category.image = el.image && <span>{el.image} <img style={{ height:40 }} src={el.image} alt=""></img></span>
          cat.push(category)
        })
        subcat = subcat.map(el => {
          let subcategory = el
          subcategory = {" ": <div>
            <button className="table-button" onClick={() => editSubcategory(el, cat)}>Editar</button>
            <button className="table-button" onClick={() => removeSubcategory(el)}>Excluir</button>
          </div>, ...el }
          return subcategory
        })
        setCategories(cat)
        setSubcategories(subcat)
      })
      .catch(err => console.log(err))
    }
    load()
  }, [])

  
  return <div className="admin-page">
    <h2 className="admin-page-title">Categorias</h2>
    {!categories || !categories.length
      ? 'Nenhua categoria'
      : <Table data={categories}></Table>
      }
      <br></br>
      <button className="button" onClick={() => createCategory()}>Nova categoria</button>
    
    <h2 className="admin-page-title">Subcategorias</h2>
    {!subcategories || !subcategories.length
      ? 'Nenhua categoria'
      : <Table data={subcategories}></Table>
      }
      <br/>
      <button className="button" onClick={() => createSubcategory()}>Nova subcategoria</button>

      <br/><br/>

    <Modal active={showModal} onClose={() => setShowModal(false)} onConfirmation={modalInfo.onConfirmation} title={modalInfo.title}>
      {modalInfo.content}
    </Modal>
  </div>
}