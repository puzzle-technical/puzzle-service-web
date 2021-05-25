import './index.css'
import { useState, useEffect } from 'react'
import api from '../../api'
import Table from '../../components/table'

export default function AdminPanel () {
  const [pendingUsers, setPendingUsers] = useState()
  const [activeUsers, setActiveUsers] = useState()

  useEffect(() => {
    let load = async () => {
      let promises = [
        api.get('admin/findActiveUsers')
          .then(res => setActiveUsers(res.data.data.map(el => {
            let ret = el
            delete ret.senha
            delete ret.senhaSalt
            delete ret.status
            ret.dataNasc = new Date(el.dataNasc).toLocaleDateString('PT-BR')
            ret.avatar = el.avatar && <img style={{ width:40, height:40, borderRadius: 100 }} src={el.avatar} alt=""></img>
            return ret
          }))),
        api.get('admin/findPendingUsers')
          .then(res => setPendingUsers(res.data.data.map(el => {
            let ret = el
            delete ret.senha
            delete ret.senhaSalt
            delete ret.status
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
  </div>
}