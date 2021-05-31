import './index.css'
import { useState, useEffect } from 'react'
import api from '../../api'
import Table from '../../components/table'
import Modal from '../../components/modal'

export default function AdminPanel () {
  const [pendingUsers, setPendingUsers] = useState()
  const [activeUsers, setActiveUsers] = useState()

  const [showModal, setShowModal] = useState()
  const [modalInfo, setModalInfo] = useState({})

  const displayAlert = (content, title = 'Atenção', onConfirmation) => {
    setModalInfo({ title, content, onConfirmation })
    setShowModal(true)
    return
  }

  const changeStatus = (user) => {
    let status = ''
    let setStatus = (s) => status = s
    let form = <div>
      <p>Selecione o novo status do usuario.</p>
      <select defaultValue={user.status} onChange={e => setStatus(e.target.value)}>
        <option value="pendente">pendente</option>
        <option value="ativo">ativo</option>
        <option value="suspenso">suspenso</option>
        <option value="inativo">inativo</option>
      </select>
    </div>
    
    displayAlert(form, 'Mudar status', async () => {
      console.log(status)
      await api.put(`users/update/${user.idUser}`, { status: status })
      .then(res => {
        displayAlert(res.data.feedback, '', () => window.location.reload())
      })
      .catch(err => {
        console.log(err)
        displayAlert(err, 'Erro')
      })
    })
  }

  useEffect(() => {
    let load = async () => {
      let promises = [
        api.get('admin/findActiveUsers')
          .then(res => {
            let result = res.data.data.map(el => {
              let allowUser = <button className="table-button" onClick={() => changeStatus(el)}>
                MUDAR STATUS 
              </button>
              let ret = { " ": allowUser, ...el}
              delete ret.senha
              delete ret.senhaSalt
              ret.dataNasc = new Date(el.dataNasc).toLocaleDateString('PT-BR')
              ret.avatar = el.avatar && <img style={{ width:40, height:40, borderRadius: 100 }} src={el.avatar} alt=""></img>
              return ret
            })
            setActiveUsers(result)
          }),
        api.get('admin/findPendingUsers')
          .then(res => setPendingUsers(res.data.data.map(el => {
            let allowUser = <button className="table-button" onClick={() => changeStatus(el)}>
              MUDAR STATUS 
            </button>
            let ret = { " ": allowUser, ...el}
            delete ret.senha
            delete ret.senhaSalt
            ret.dataNasc = new Date(el.dataNasc).toLocaleDateString('PT-BR')
            ret.avatar = el.avatar && <img style={{ width:40, height:40, borderRadius: 100 }} src={el.avatar} alt=""></img>
            return ret
          })))
      ]
      await Promise.all(promises)
      // console.log(pendingUsers);
    }
    load()
  }, [])

  
  return <div className="admin-page">
    <h2 className="admin-page-title">Usuários pendentes</h2>
    {!pendingUsers || !pendingUsers.length
      ? 'Nenhum usuário pendente'
      : <Table data={pendingUsers}></Table>
      }

    <h2 className="admin-page-title">Usuários ativos</h2>
    {!activeUsers || !activeUsers.length
      ? 'Nenhum usuário pendente'
      : <Table data={activeUsers}></Table>
      }
      
    <Modal active={showModal} onClose={() => setShowModal(false)} onConfirmation={modalInfo.onConfirmation} title={modalInfo.title}>
      {modalInfo.content}
    </Modal>
  </div>
}