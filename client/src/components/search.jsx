import React from 'react';
import $ from "jquery";

function Search(props) {
  const [resultList, setResultList] = React.useState(null);
  const getResult = (cSearch) => {
    fetch(`/search?class=${cSearch}`)
    .then(result => result.json())
    .then((body) => setResultList(body))
    .catch(error => console.log(error));
  };

  const handleSearch = () => {
    getResult($("#myClassSelect").val());
  };

  const cAbbr = ['N/A','AST','BRD','BLM','DRK','DRG','MCN','MNK','NIN',
  'PLD','SCH','SMN','WAR','WHM','RDM','SAM','DNC','GNB','Recruiting'];

  if(props.loggedIn){
    return (
      <div className="App" id="SearchPage">
        <div className="App-header">
          <h1>Search</h1>
        </div>
      
      
      <div className="App-main">
        <div id="myClass">
          <p style={{display:"inline"}}>I am a  </p>
          <select style={{display:"inline"}} id="myClassSelect">
            <option value="t">Tank</option>
            <option value="h">Healer</option>
            <option value="d">DPS</option>
          </select>
          <p style={{display:"inline"}}>  -{'>'}  </p>
          <button style={{display:"inline"}} onClick={handleSearch}>Search!</button>
        </div>
        <div id="myResults">
          {resultList && (
            resultList.teams.length === 0
            ? <p>No results, try another job type?</p>
            : 
            <section>
              {resultList.teams.map((teamIndex, index) => (
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
                  <hr />
                </span>
              ))}
            </section>
          )}
          </div>
        </div>
        <hr className="breakHR" />
      </div>
    );
  }else{
    return (<div className="App" id="SearchPage" />);
  }
}
      
export default Search;