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
        <div className="App">
        <header className="App-header">
            <h1>FFXIV Raid Gear Distributor</h1>
        </header>

        <main className="App-main">
            <button onClick={getRanking}>Show Ranking</button>
            {rankingList && (
                rankingList.message === 'FFlogs API Error'
                ? <p>FFlogs API Error</p>
                : <section>
                    {rankingList.ranking.map((rankingIndex, index) => (
                        <span key={index}>
                        <p><b>{rankingIndex.name}</b></p>
                        <p>{rankingIndex.dps}</p>
                        <hr></hr>
                        </span>
                    ))}
                </section>
            )}
      </main>
    </div>
  );
}

export default Ranking;
