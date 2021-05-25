import './index.css'
// import { useState, useRef } from 'react'

export default function Table (props) {
  const { data } = props

  return <div className="table-wrapper" >
    <table>
      <thead>
        <tr>
          {Object.keys(data[0]).map((prop, index) => <th key={index}>{prop}</th>)}
        </tr>
      </thead>
      <tbody>
        {data.map((user, index) => 
          <tr key={index}>
            {Object.keys(user).map((prop, i) => <td key={i}>{user[prop]}</td>)}
          </tr>
        )}
      </tbody>
    </table>
  </div>
}