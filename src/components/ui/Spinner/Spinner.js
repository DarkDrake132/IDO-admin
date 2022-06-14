
/* 
  type: grow || border
  inButton: true || false (style for spinner used in button)
  small: true || false (size small or normal)
*/  
const Spinner = ({type='border', small, inButton}) => {
  let styleName = `spinner-${type}`;
  if (small)
    styleName += ` spinner-${type}-sm`
  if (inButton)
    styleName += ' spinner-in-button'
  return (
    <div className={styleName} role="status"></div>
  )
}

export default Spinner;