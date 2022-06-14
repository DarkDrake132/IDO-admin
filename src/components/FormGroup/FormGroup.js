import FormElement from './FormElement';

const FormGroup = ({ elements, isReadOnly, handleChange}) => {
  //function for displaying elements in form
  const displayForm = (formElements) => {
    let formElementsArray = [];
    let row = [];
    formElements.forEach((element, index) => {
      if (!(row.length === 2)) {
        row.push(
          <FormElement 
            key={index}
            widthtype={element.widthType}
            label={element.label}
            element={element}
            isReadOnly={isReadOnly}
            handleChange={handleChange}
          />
        );
      }
      
      // if the input length require full size, push the element in the row to the display array
      if (element.widthType === "full") {
        formElementsArray.push(row);
        row = [];
      }
      else if (row.length === 2) {
        formElementsArray.push(row);
        row = [];
      }
      else if (index === (Object.keys(elements).length - 1) && row.length > 0) {
        formElementsArray.push(row);
        row = [];
      }
    });
    
    return formElementsArray;
  };

  return (
    displayForm(Object.values(elements)).map(
      (row, index) => {
        return (
          <div className="row my-2" key={index}>
            {row}
          </div>
        );
      }
    )
  )
}

export default FormGroup;