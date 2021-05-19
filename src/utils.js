export const wrapLogRequest = async (promise, callback, errorCallback) => {
  await promise
  .then(res => {
    console.log(res)
    if (typeof callback == 'function') callback(res)
  })
  .catch(err => {
    console.log(err)
    if (typeof errorCallback == 'function') errorCallback(err)
  })
}