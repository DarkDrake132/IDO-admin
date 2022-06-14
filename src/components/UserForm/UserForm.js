import { useState, useEffect } from 'react'

import Card from "../Card/Card";
import FormGroup from '../FormGroup/FormGroup'
import ButtonGroup from "../ButtonGroup/ButtonGroup";

const UserForm = ({
  userDetails, setUserDetails,
  newUserDetail,
  //
  readOnly=false,
  setHasChanged,
  //
  buttons
}) => {

  useEffect(()=>{
    console.log('user details: ', userDetails)
  },[userDetails])

  // function for handling changes for user inputs
  // update value at e.target and update to the user at userDetails[index]
  const handleUserListChange = (e, index) => {
    const { name, value } = e.target;
    // create new user array
    const newUserDetailArray = [...userDetails];
    // get old detail
    const oldUserDetail = userDetails[index];
    // update new {name, value} for user at position {index} in array
    newUserDetailArray[index] = {
      ...oldUserDetail,
      [name]: {
        ...oldUserDetail[name],
        value: value
      }
    }
    // save change to user details
    setUserDetails(newUserDetailArray)
    setHasChanged(true)
  }

  const handleAddUser = () => {
    const newUserDetailArray = [...userDetails];
    newUserDetailArray.push(newUserDetail);
    setUserDetails(newUserDetailArray);
  }

  const addUserButton = (
    <button
      type="button"
      className="btn btn-outline-info btn-icon-text"
      onClick={handleAddUser}
    >
      Add<i className="ti-plus btn-icon-append"></i>
    </button>
  )

  return (
    <div className="row">
      <form className="forms-sample">
        {/* user information section */}
        <div className="col-12 grid-margin stretch-card">
          <Card
            title="User information"
            description={"Enter the user detail information"}
          >
            {
              userDetails.map((user, index) => {
                return (
                  <FormGroup 
                    key={index}
                    elements={user}
                    isReadOnly={readOnly}
                    handleChange={e => handleUserListChange(e, index)}
                  />
                )
              })
            }
            {addUserButton}
          </Card>
        </div>
        {/* buttons section */}
        <ButtonGroup 
          buttons={buttons}
          align='center'
        />
      </form>
    </div>
  )
}

export default UserForm;