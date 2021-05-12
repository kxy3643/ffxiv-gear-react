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

//team maker helper
const handleMakeTeam = (e, props, setModal, getMyTeams) => {
  e.preventDefault();
  
  if($("#name").val() === '' || $("#contact").val() === ''){
    setModal(<MyModal title={"Error"} message={"All text fields are required!"} onClose={setModal}/>);
    return false;
  }
  
  sendAjax('POST', $("#teamMakerForm").attr("action"), $("#teamMakerForm").serialize(), 
  () => {
    setModal(<MyModal title={"Success"} message={"Team has been submitted"} onClose={setModal}/>);
  }, setModal
  );
  
  
  getMyTeams();
  props.onUpdate(props.updateStatus += 1);
  
  return false;
}

//team delete helper
const handleDeleteTeam = (e, props, setModal, getMyTeams, index) => {
  e.preventDefault();
  
  sendAjax('POST', $("#"+index+"teamDeleteForm").attr("action"), $("#"+index+"teamDeleteForm").serialize(), 
  () => {
    setModal(<MyModal title={"Success"} message={"Team has been deleted"} onClose={setModal}/>);
  }, setModal
  );
  
  getMyTeams();
  props.onUpdate(props.updateStatus += 1);
  
  return false;
}


const tankSelect = (id) => {
  return (
    <select id={id} name={id}>
    <option value="4">DRK</option>
    <option value="9">PLD</option>
    <option value="12">WAR</option>
    <option value="17">GNB</option>
    <option value="18">Recruiting</option>
    <option value="0">N/A</option>
    </select>
  );
}
  
const healerSelect = (id) => {
  return (
    <select id={id} name={id}>
    <option value="1">AST</option>
    <option value="10">SCH</option>
    <option value="13">WHM</option>
    <option value="18">Recruiting</option>
    <option value="0">N/A</option>
    </select>
  );
}
    
const dpsSelect = (id) => {
  return (
    <select id={id} name={id}>
    <option value="2">BRD</option>
    <option value="3">BLM</option>
    <option value="5">DRG</option>
    <option value="6">MCN</option>
    <option value="7">MNK</option>
    <option value="8">NIN</option>
    <option value="11">SMN</option>
    <option value="14">RDM</option>
    <option value="15">SAM</option>
    <option value="16">DNC</option>
    <option value="18">Recruiting</option>
    <option value="0">N/A</option>
    </select>
    );
}
      
//component
function TeamPage(props) {
  const [modal, setModal] = React.useState(null);
  
  const cAbbr = ['N/A','AST','BRD','BLM','DRK','DRG','MCN','MNK','NIN',
  'PLD','SCH','SMN','WAR','WHM','RDM','SAM','DNC','GNB','Recruiting'];
  
  const [teamList, setTeamList] = React.useState(null);
  const getMyTeams = () => {
    fetch('/getMyTeams')
    .then(result => result.json())
    .then((body) => setTeamList(body))
    .catch(error => console.log(error));
  };
  
  //render maker
  const renderMaker = (props) => {
    return (
      <div id="teamMaker">
      <form id="teamMakerForm" name="teamMakerForm" 
      onSubmit={e => handleMakeTeam(e, props, setModal, getMyTeams)}
      action="/makeTeam"
      method="POST"
      className="mainForm"
      >
      <label htmlFor="name">Team Name:</label>
      <input id="name" type="text" name="name" placeholder="Team Group" /> <br/>
      <label htmlFor="contact">Discord Contact:</label>
      <input id="contact" type="text" name="contact" placeholder="Discord#0000" /><br/>
      
      <label htmlFor="t1">T1: </label>
      {tankSelect("t1")} <br/>
      <label htmlFor="t2">T2: </label>
      {tankSelect("t2")} <br/>
      <label htmlFor="h1">H1: </label>
      {healerSelect("h1")} <br/>
      <label htmlFor="h2">H2: </label>
      {healerSelect("h2")} <br/>
      <label htmlFor="d1">D1: </label>
      {dpsSelect("d1")} <br/>
      <label htmlFor="d1">D2: </label>
      {dpsSelect("d2")} <br/>
      <label htmlFor="d1">D3: </label>
      {dpsSelect("d3")} <br/>
      <label htmlFor="d1">D4: </label>
      {dpsSelect("d4")} <br/>
      
      <input type="hidden" name="_csrf" value={props.csrf} />
      <input className="formSubmit" type="submit" value="Submit"/>
      </form>
      </div>
      );
  };
  
  //render team list
  const renderMyTeams = (props) => {
    return (
      <div id="myTeams">
        {teamList && (
          teamList.teams.length === 0
          ? <p>You do not have any teams yet!</p>
          : 
          <section>
            {teamList.teams.map((teamIndex, index) => (
              <span key={index}>
                <p>Name: <b>{teamIndex.name}</b></p>
                <p>Contact: <i>{teamIndex.contact}</i></p>
                <p>T1: {cAbbr[teamIndex.t1]}</p>
                <p>T2: {cAbbr[teamIndex.t2]}</p>
                <p>H1: {cAbbr[teamIndex.h1]}</p>
                <p>H2: {cAbbr[teamIndex.h2]}</p>
                <p>D1: {cAbbr[teamIndex.d1]}</p>
                <p>D2: {cAbbr[teamIndex.d2]}</p>
                <p>D3: {cAbbr[teamIndex.d3]}</p>
                <p>D4: {cAbbr[teamIndex.d4]}</p>
                <form id={index + "teamDeleteForm"} name={index + "teamDeleteForm"}
                onSubmit={e => handleDeleteTeam(e, props, setModal, getMyTeams, index)}
                action="/deleteTeam"
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
  //auto update after changes in component  
  React.useEffect(() => {
    getMyTeams();
    if(props.loggedIn){
      return (
        <div className="App" id="TeamPage">
        <div className="App-header">
        <h1>My Teams</h1>
        </div>
        {renderMyTeams(props)}
        <hr className="breakHR" />
        <div className="App-header">
        <h1>Make a Team</h1>
        </div>
        {renderMaker(props)}
        {modal}
        <hr className="breakHR" />
        </div>
        );
    }else{
        return (<div className="TeamPage" />);
    }
  }, [props.loggedIn ,props.updateStatus]);
            
  //dafault return  
  if(props.loggedIn){
    return (
      <div className="App" id="TeamPage">
      <div className="App-header">
      <h1>My Teams</h1>
      </div>
      {renderMyTeams(props)}
      <hr className="breakHR" />
      <div className="App-header">
      <h1>Make a Team</h1>
      </div>
      {renderMaker(props)}
      {modal}
      <hr className="breakHR" />
      </div>
      );
    }else{
      return (<div className="TeamPage" />);
  }
    
}
                  
export default TeamPage;
                  