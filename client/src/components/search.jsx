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
            <div className="App" id="SearchPage">
                <div className="App-header">
                    <h1>Search</h1>
                </div>
        
                <div className="App-main">
                    
                </div>
                <hr className="breakHR" />
            </div>);
    }else{
        return (<div className="App" id="SearchPage" />);
    }
}

export default Search;