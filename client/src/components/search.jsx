import React from 'react';

function Search(props) {
    const [rankingList, setRankingList] = React.useState(null);
    const getRanking = () => {
        fetch('/getTopDPS')
            .then(result => result.json())
            .then((body) => setRankingList(body))
            .catch(error => console.log(error));
    };


    if(props.loggedIn){
        return (
            <div className="TeamPage">
                <header className="App-header">
                    <h1>Search</h1>
                </header>
        
                <main className="App-main">
                    
                </main>
            </div>);
    }else{
        return (<div className="TeamPage" />);
    }
}

export default Search;