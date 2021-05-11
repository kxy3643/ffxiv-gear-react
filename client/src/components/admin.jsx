import React from 'react';

function AdminPage(props) {
    const [rankingList, setRankingList] = React.useState(null);
    const getRanking = () => {
        fetch('/getTopDPS')
            .then(result => result.json())
            .then((body) => setRankingList(body))
            .catch(error => console.log(error));
    };


    if(props.loggedIn){
        return (
            <div className="App" id="AdminPage">
                <div className="App-header">
                    <h1>Admin</h1>
                </div>
        
                <div className="App-main">
                    
                </div>
                <hr className="breakHR" />
            </div>);
    }else{
        return (<div className="App" id="AdminPage" />);
    }
}

export default AdminPage;