import Label from '../ui/Label/Label'

const displayButton = (button, key) => {
  const handleOnClick = () => {
    if (!button.onClick)
      console.log('default button clicked');
    else
      button.onClick()
  }
  switch(button.type){
    case 'delete':
      return (
        <button key={key} className='btn btn-danger' onClick={handleOnClick}>Delete</button>
      )
    case 'edit':
      return (
        <button key={key} onClick={handleOnClick}>Edit</button>
      )
    default:
      return (
        <button key={key} onClick={handleOnClick}>Default</button>
      )
  }
}

const displayButtons = (buttons) => {
  return buttons.map((button, index) => {
    return (
      displayButton(button, index)
    )
  })
}

const displayInputs = (inputs) => {
  return inputs.map((input, index) => {
    return (
      <td key={index}>
        <input 
          className='custom-table-input'
          {...input}
        />
      </td>
    )
  })
}

const displayKYC = (value) => {
  if (value) 
    return <i className="fa fa-check check-icon"></i>
  else 
    return <i className="fa fa-times close-icon"></i>
}

const TData = ({ data, isHeader }) => {
  const keyName = data[0];
  const value = data[1];
  let displayItem;
  switch (keyName) {
    case 'kyc':
      displayItem = <td>{displayKYC(value)}</td>
      break;
    case 'status':
      displayItem = <td><Label type={value.labelType} text={value.labelText}/></td>
      break;
    case 'inputs':
      displayItem = displayInputs(value)
      break;
    case 'buttons':
      displayItem = <td>{displayButtons(value)}</td>
      break;
    default:
      displayItem = <td>{value}</td>;
  }

  if (isHeader) {
    return <th>{data}</th>;
  } else {
    return displayItem
  }
};

export default TData;
