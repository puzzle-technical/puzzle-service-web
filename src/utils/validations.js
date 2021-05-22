
// const required = 'Esse campo é obrigatório!'
const required = false

export const nome = {
  required,
  pattern: {
    value: /^[A-Za-zà-úÀ-Ú\s]+$/,
    message: 'Apenas letras e espaços são permitidos.'
  },
  validate: {
    moreThanOneWord: v => v.trim().split(' ').length > 1 || 'É necessário nome e sobrenome.'
  }
}

export const email = {
  pattern: {
    value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
    message: 'Formato de email inválido.'
  },
  required
}

export const senha = {
  required
}

export const senhaConfirmada = {
  required
}

export const cpf = {
  required
}

export const dataNasc = {
  required
}

export const celular = {
  required
}

export const cep = {
  required
}

export const uf = {
  required
}

export const cidade = {
  required
}

export const bairro = {
  required
}

export const logradouro = {
  required
}

export const numero = {
  required
}