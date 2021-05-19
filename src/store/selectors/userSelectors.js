export const userHasData = state => state.userState.user && state.userState.user != {}

export const getUser = state => state.userState.user

export const getCurrentService = state => state.userState.currentService