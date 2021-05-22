export const Field = function (props) {
  const { classes, labelName, children, addons = undefined } = props
  
  return <div className={`field ${classes}`}>
  <div className="control is-expanded">
    <label className="puzzle-label">{labelName}</label>
    {children}
  </div>
  {addons}
</div>
}

export const Input = function(props) {
  const { keyName, register, errors = {}, validation = {}, ...rest } = props

  return <>
    <input {...rest}
      className={`input ${errors[keyName] && 'is-danger'}`}
      {...register(keyName, validation)}
    />
    {errors[keyName] && <p className="help is-danger">{errors[keyName].message}</p>}
  </>
}