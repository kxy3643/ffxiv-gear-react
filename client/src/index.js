import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import TopNav from './components/topNav';
import Team from './components/team';
import Admin from './components/admin';
import Search from './components/search';
import $ from "jquery";

const sendAjax = (type, action, data, success) => {
  $.ajax({
      cache: false,
      type: type,
      url: action,
      data: data,
      dataType: "json",
      success: success
  });
};

const Index = (props) => {
  const [loginStatus, setLoginStatus] = React.useState(false);
  const [adminStatus, setAdminStatus] = React.useState(false);
  const [updateStatus, setUpdateStatus] = React.useState(0);

  return (
    <React.StrictMode>
      <TopNav csrf={props.csrf} onLogin={setLoginStatus} isAdmin={setAdminStatus}/>
      {loginStatus ? 
        adminStatus ? (
          //If logged in && admin
          <>
            <Admin csrf={props.csrf} loggedIn = {true}/>
            <Team csrf={props.csrf} updateStatus={updateStatus} onUpdate={setUpdateStatus} loggedIn = {true}/>
          </>
          ) : (
          //If logged in
          <Team csrf={props.csrf} updateStatus={updateStatus} onUpdate={setUpdateStatus} loggedIn = {true}/>
        ): (
        //Else not logged in
        <Team csrf={props.csrf} loggedIn = {false}/>
      )}
      {loginStatus ? (
        //If logged in
        <Search csrf={props.csrf} loggedIn = {true}/>
      )
      : (
        //Else not logged in
        <Search csrf={props.csrf} loggedIn = {false}/>
      )}
      <App />
    </React.StrictMode>
  );
}

$(document).ready(function() {
  sendAjax('GET', '/getToken', null, (result) => {

    ReactDOM.render(
      <Index csrf={result.csrfToken}/>,
      document.getElementById('root')
    );
  });
  
  
});




/*
const setup = (csrf) => {
  const [loginStatus, setLoginStatus] = React.useState(false);

  
  const topNavLogin = (csrf) => {
    if(loginStatus === true){
      return <TeamPage csrf={csrf} loggedIn = {true}/>
    }else{
      return <TeamPage csrf={csrf} loggedIn = {false}/>
    }
  }

  ReactDOM.render(
    <React.StrictMode>
      <TopNav csrf={csrf} onLogin={setLoginStatus}/>
      {topNavLogin(csrf)}
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  );
}

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
      setup(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
});

*/
