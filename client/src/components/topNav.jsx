import React from 'react';
import $ from "jquery";
import MyModal from "./modal"

const loggedIn = (props, setNav, renderLoggedIn, name) => {
  setNav(renderLoggedIn(props, name))
  props.onLogin(true);
  if(name === "ykc200" || name === "tony"){
    props.isAdmin(true);
  }
};

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

const handleLogin = (e, props, setNav, renderLoggedIn, setModal) => {
  e.preventDefault();

  if($("#user").val() === '' || $("#pass").val() === ''){
    setModal(<MyModal title={"Error"} message={"All fields are required!"} onClose={setModal}/>);
    return false;
  }

  sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), 
            () => {loggedIn(props, setNav, renderLoggedIn, $("#user").val())}, setModal);

  return false;
};

const handleSignup = (e, props, setNav, renderLoggedIn, setModal) => {
  e.preventDefault();

  if($("#user").val() === '' || $("#pass").val() === '' || $("#pass2").val() === ''){
    setModal(<MyModal title={"Error"} message={"All fields are required!"} onClose={setModal}/>);
    return false;
  }

  if($("#pass").val() !== $("#pass2").val()){
    setModal(<MyModal title={"Error"} message={"Passwords must be the same!"} onClose={setModal}/>);
    return false;
  }

  sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), 
            () => {loggedIn(props, setNav, renderLoggedIn, $("#user").val())}, setModal);

  return false;
};


function TopNav(props) {
  const renderLogin = (props) => {
    return (
      <>
      <form id="loginForm" name="loginForm" style={{display:"inline"}}
        onSubmit={e => handleLogin(e, props, setNavHolder, renderLoggedIn, setModal)}
        action="/login"
        method="POST"
        className="mainForm" >
          <label htmlFor="username">Username:</label>
          <input id="user" type="text" name="username" placeholder="username"/>
          <label htmlFor="pass">Password:</label>
          <input id="pass" type="password" name="pass" placeholder="password"/>
          <input type="hidden" name="_csrf" value={props.csrf} />
          <input className="formSubmit" type="submit" value="Sign in"/>
      </form>
      <p style={{display:"inline"}}> Or </p>
      <button onClick={() => setNavHolder(renderSignup(props))}>Sign up</button>
      </>
    )
  };

  const renderSignup = (props) => {
    return (
      <>
      <form id="signupForm" name="signupForm" style={{display:"inline"}}
        onSubmit={e => handleSignup(e, props, setNavHolder, renderLoggedIn, setModal)}
        action="/signup"
        method="POST"
        className="mainForm"
        >
        <label htmlFor="username">Username:</label>
        <input id="user" type="text" name="username" placeholder="username" />
        <label htmlFor="pass">Password:</label>
        <input id="pass" type="password" name="pass" placeholder="password" />
        <label htmlFor="pass2">Password:</label>
        <input id="pass2" type="password" name="pass2" placeholder="retype password" />
        <input type="hidden" name="_csrf" value={props.csrf} />
        <input className="formSubmit" type="submit" value="Sign up"/>
      </form>
      <p style={{display:"inline"}}> Or </p>
      <button onClick={() => setNavHolder(renderLogin(props))}>Sign in</button>
      </>
    );
  };

  const renderLoggedIn = (props, name) => {
    return (
      <>
      <p style={{display:"inline"}}>Hello, <i>{name}</i> | </p>
      <p style={{display:"inline"}}>  </p>
      <a onClick={() => setNavHolder(renderLogin(props))} href="/logout">
        Logout
        </a>
      </>
    );
  };

  const [navHolder, setNavHolder] = React.useState(renderLogin(props));
  const [modal, setModal] = React.useState(null);
  
  return (
    <div className="topNav">
      {navHolder}
      {modal}
    </div>
  );
}

export default TopNav;
