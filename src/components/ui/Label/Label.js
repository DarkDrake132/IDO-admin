

const Label = ({type, text}) => {
  return (
    <label className={["badge badge-", type].join("")}>
      {text}
    </label>
  )
}

export default Label;