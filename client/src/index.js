import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import TopNav from './components/topNav';
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

const setup = (csrf) => {
  console.log(csrf);
  ReactDOM.render(
    <React.StrictMode>
      <TopNav csrf={csrf}/>
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
