import React from 'react';
import $ from "jquery";
import MyModal from "./modal"

//ajax helper
const sendAjax = (type, action, data, success, setModal) => {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function(xhr, status, error){
      let messageObj = JSON.parse(xhr.responseText);
      setModal(<MyModal title={"Error"} message={messageObj.error} onClose={setModal}/>);
    }
  });
};

//delete team helper
const handleDeleteTeam = (e, props, setModal, getAdmin, index) => {
  e.preventDefault();
  
  sendAjax('POST', $("#"+index+"adminDeleteForm").attr("action"), $("#"+index+"adminDeleteForm").serialize(), 
  () => {
    setModal(<MyModal title={"Success"} message={"Team has been deleted"} onClose={setModal}/>);
  }, setModal
  );
  
  getAdmin();
  props.onUpdate(props.updateStatus += 1);
  
  return false;
}

//page component
function AdminPage(props) {
  const [modal, setModal] = React.useState(null);
  const [adminList, setAdminList] = React.useState(null);
  
  //update
  const getAdmin = () => {
    fetch('/getAdmin')
    .then(result => result.json())
    .then((body) => setAdminList(body))
    .catch(error => console.log(error));
  };
  
  //force updating state
  const forceUpdate = () => {
    getAdmin();
    props.onUpdate(props.updateStatus + 1);
  };
  
  //render
  const renderAllTeams = (props) => {
    return (
      <div id="allTeams">
        <button onClick={forceUpdate}>Force Update</button>
        {adminList && (
          adminList.teams.length === 0
          ? <p>No teams in Database</p>
          : 
          <section>
            {adminList.teams.map((teamIndex, index) => (
              <span key={index}>
                <p>Name: <b>{teamIndex.name}</b></p>
                <p>Contact: <i>{teamIndex.contact}</i></p>
                <form id={index + "adminDeleteForm"} name={index + "adminDeleteForm"}
                onSubmit={e => handleDeleteTeam(e, props, setModal, getAdmin, index)}
                action="/deleteAdmin"
                method="POST"
                className="mainForm"
                >
                  <input type="hidden" name="_csrf" value={props.csrf} />   
                  <input type="hidden" name="name" value={teamIndex.name} />
                  <input className="formSubmit" type="submit" value="Delete"/> 
                </form>
                <hr />
              </span>
            ))}
          </section>
        )}
      </div>
    );    
  }
  
  //auto update after action in component
  React.useEffect(() => {
    getAdmin();
    if(props.loggedIn){
      return (
        <div className="App" id="AdminPage">
          <div className="App-header">
            <h1>Admin</h1>
          </div>
          
          <div className="App-main">
            {renderAllTeams(props)}
            {modal}
          </div>
          <hr className="breakHR" />
        </div>);
    }else{
        return (<div className="App" id="AdminPage" />);
    }
  }, [props.loggedIn ,props.updateStatus]);
          
  //default return  
  if(props.loggedIn){
    return (
      <div className="App" id="AdminPage">
        <div className="App-header">
          <h1>Admin</h1>
        </div>
        
        <div className="App-main">
          {renderAllTeams(props)}
          {modal}
        </div>
        <hr className="breakHR" />
      </div>);
  }else{
    return (<div className="App" id="AdminPage" />);
  }
}
          
export default AdminPage;