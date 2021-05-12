import React from 'react';

function Ranking() {
  const [rankingList, setRankingList] = React.useState(null);
  const getRanking = () => {
    fetch('/getTopDPS')
    .then(result => result.json())
    .then((body) => setRankingList(body))
    .catch(error => console.log(error));
  };
  
  
  return (
    <div className="App" id="Ranking">
      <div className="App-header">
      <h1>FFXIV aDPS RANKING (EDEN'S PROMISE)</h1>
      </div>
    
      <div className="App-main">
        <button onClick={getRanking}>Show Ranking</button>
        {rankingList && (
          rankingList.message === 'FFlogs API Error'
          ? <p>FFlogs API Error</p>
          : 
          <section>
            {rankingList.ranking.map((rankingIndex, index) => (
              <span key={index}>
                <p><b>{rankingIndex.name}</b></p>
                <p>{rankingIndex.dps}</p>
                <hr />
              </span>
            ))}
          </section>
        )}
      </div>
      <hr className="breakHR" />
    </div>
  );
}
      
export default Ranking;
      