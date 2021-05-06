import React from 'react';
import $ from "jquery";

const loggedIn = (props, setNav, renderLoggedIn, name) => {
  setNav(renderLoggedIn(props, name))
  props.onLogin(true);
  if(name === "ykc200" || name === "tony"){
    console.log("welcome admin");
    props.isAdmin(true);
  }
};

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

const handleLogin = (e, props, setNav, renderLoggedIn) => {
  e.preventDefault();

  if($("#user").val() === '' || $("#pass").val() === ''){
    return false;
  }

  sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), 
            loggedIn(props, setNav, renderLoggedIn, $("#user").val()));

  return false;
};

const handleSignup = (e) => {
  e.preventDefault();

  if($("#user").val() === '' || $("#pass").val() === '' || $("#pass2").val() === ''){
      return false;
  }

  if($("#pass").val() !== $("#pass2").val()){
      return false;
  }

  sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), loggedIn);

  return false;
};


function TopNav(props) {
  const renderLogin = (props) => {
    return (
      <>
      <form id="loginForm" name="loginForm" style={{display:"inline"}}
        onSubmit={e => handleLogin(e, props, setNavHolder, renderLoggedIn)}
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
        onSubmit={handleSignup}
        action="/signup"
        method="POST"
        className="mainForm"
        >
        <label htmlFor="username">Username:</label>
        <input id="user" type="text" name="username" placeholder="username"/>
        <label htmlFor="pass">Password:</label>
        <input id="pass" type="password" name="pass" placeholder="password"/>
        <label htmlFor="pass2">Password:</label>
        <input id="pass2" type="password" name="pass2" placeholder="retype password"/>
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
      <p style={{display:"inline"}}> Or </p>
      <a onClick={() => setNavHolder(renderLogin(props))} href="/logout">
        Logout
        </a>
      </>
    );
  };


  const [navHolder, setNavHolder] = React.useState(renderLogin(props));
  
  return (
    <div className="topNav">
      {navHolder}
    </div>
  );
}

export default TopNav;
