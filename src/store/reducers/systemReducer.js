import { UPDATE_ALERT } from '../actions/actionTypes'

const defaultState = {
  alert: {
    isActive: false,
    message: 'Mensagem',
    title: 'Atenção',
    cancelButton: 'Cancelar',
    okButton: 'OK',
    confirmationCallback: () => ({})
  }
}

export default function systemReducer (state = defaultState, action) {
  switch (action.type) {
    case UPDATE_ALERT:
      let updateAlert = {...defaultState.alert}
      for (const key of Object.keys(action.alert)) {
        if (Object.keys(updateAlert).includes(key)) updateAlert[key] = action.alert[key]
      }
      return {
        ...state,
        alert: updateAlert
      }
    default:
      return state
  }
}