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
      let updateAlert = {}
      for (const key of Object.keys(defaultState.alert)) {
        if (Object.keys(action.alert).includes(key)) updateAlert[key] = action.alert[key]
        else updateAlert[key] = defaultState.alert[key]
      }
      return {
        ...state,
        alert: updateAlert
      }
    default:
      return state
  }
}