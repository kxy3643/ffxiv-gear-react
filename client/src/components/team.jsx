import React from 'react';
import $ from "jquery";
import MyModal from "./modal"

const submitted = (props) => {

}

const sendAjax = (type, action, data, success, setModal) => {
    $.ajax({
      cache: false,
      type: type,
      url: action,
      data: data,
      dataType: "json",
      success: function(){success()},
      error: function(xhr, status, error){
        let messageObj = JSON.parse(xhr.responseText);
        setModal(<MyModal title={"Error"} message={messageObj.error} onClose={setModal}/>);
      }
    });
};

const handleMakeTeam = (e, props, setModal) => {
    e.preventDefault();

    if($("#name").val() === '' || $("#contact").val() === ''){
        setModal(<MyModal title={"Error"} message={"All text fields are required!"} onClose={setModal}/>);
        return false;
    }

    sendAjax('POST', $("#teamMakerForm").attr("action"), $("#teamMakerForm").serialize(), 
            () => {submitted(props)}, setModal);

    return false;
}


const tankSelect = (id) => {
    return (
        <select id={id} name={id}>
                <option value="4">DRK</option>
                <option value="9">PLD</option>
                <option value="12">WAR</option>
                <option value="99">Recruiting</option>
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
                <option value="99">Recruiting</option>
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
                <option value="99">Recruiting</option>
                <option value="0">N/A</option>
        </select>
    );
}


function TeamPage(props) {
    const [modal, setModal] = React.useState(null);

    const cAbbr = ['','AST','BRD','BLM','DRK','DRG','MCN','MNK','NIN',
    'PLD','SCH','SMN','WAR','WHM','RDM','SAM','DNC','GNB',];


    const renderMaker = (props) => {
        return (
          <form id="teamMakerForm" name="teamMakerForm" 
            onSubmit={e => handleMakeTeam(e, props, setModal)}
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
        );
    };

    
    if(props.loggedIn){
        return (
            <div className="TeamPage">
                <h1>Team</h1>
                {renderMaker(props)}
                {modal}
            </div>
            );
    }else{
        return (<div className="TeamPage" />);
    }
}

export default TeamPage;
