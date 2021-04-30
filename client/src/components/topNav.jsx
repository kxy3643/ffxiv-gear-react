import React from 'react';
import $ from "jquery";

const loggedIn = (obj) => {
  console.log(obj);
  alert("im in");
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

const handleLogin = (e) => {
  e.preventDefault();

  if($("#user").val() === '' || $("#pass").val() === ''){
    return false;
  }

  sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), loggedIn);

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
    console.log(props.csrf);
    return (
      <>
      <form id="loginForm" name="loginForm" style={{display:"inline"}}
        onSubmit={handleLogin}
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

  const [navHolder, setNavHolder] = React.useState(renderLogin(props));
  

  return (
    <div className="topNav">
      {navHolder}
    </div>
  );
}

export default TopNav;
