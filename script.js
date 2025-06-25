document.addEventListener("DOMContentLoaded",function(){
    const searchButton=document.getElementById("search-button");
    const userInput=document.getElementById("user-input");
    const statsContainer=document.querySelector(".stats-container");
    const easyProgressCircle=document.querySelector(".easy-progress");
    const mediumProgressCircle=document.querySelector(".medium-progress");
    const hardProgressCircle=document.querySelector(".hard-progress");
    const easyLabel=document.getElementById("easy-label");
    const mediumLabel=document.getElementById("medium-label");
    const hardLabel=document.getElementById("hard-label");
    const cardStatsContainer=document.querySelector(".stats-card");
    function validateUsername(username){//returns true or false based on regular expression
        if(username.trim()===""){
            alert("username shouldnt be empty");
            return false;
        }
        const regex=/^[a-zA-Z][a-zA-Z0-9_]{2,15}$/;//generated form chatGPT
        const isMatching=regex.test(username);
        if(!isMatching)//validate the input username on the basis of regular expression
        {
            alert("Invalid Username");
        }
        return isMatching;
    }
    async function fetchUserDetails(username)
    {
        const url=`https://leetcode-stats-api.herokuapp.com/${username}`;
        try{
            searchButton.textContent="Searching....";
            searchButton.disabled=true;
            const response=await fetch(url);
            if(!response.ok)
                    throw new Error("Unable to fetch the user details");
            
            const parsedData=await response.json();
            console.log("Logging Data",parsedData);
            if(parsedData.message=='user does not exist')
            {
                alert("Specified user does not exist");
            }
            displayUserData(parsedData);

            // if(response)
            // {
            //     searchButton.textContent="Search";
            //     searchButton.disabled=false;
            // } 
            //to make the seacrh button available again after the data has been fetched, this process can also be substituted by the finally block, a better practice than the if else mechanism
            
        }
        catch(error)
        {
            statsContainer.innerHTML=`<p>No data found</p>`;
        }
        finally{
            searchButton.textContent="Search";
            searchButton.disabled=false;
        }
    }
    searchButton.addEventListener('click', function(){
        const username=userInput.value;
        console.log("Logging username: ", username);
        if(validateUsername(username)){// if valid username fetch user details using API endpoint
            fetchUserDetails(username);
        }

    });

    function updateProgress(solved, total, circle, label) {
        const progressDegree = (solved/total)*100;
        circle.style.setProperty("--progress-degree", `${progressDegree}%`);
        label.textContent = `${solved}/${total}`;
    }

    async function displayUserData(parsedData){
        //extract all required data
        const totalHardQuestions=parsedData.totalHard;
        const totalEasyQuestions=parsedData.totalEasy;
        const totalMediumQuestions=parsedData.totalMedium;
        const totalQuestions=parsedData.totalQuestions;
        const totalSolved=parsedData.totalSolved;
        const easySolved=parsedData.easySolved;
        const mediumSolved=parsedData.mediumSolved;
        const hardSolved=parsedData.hardSolved;
        const acceptanceRate=parsedData.acceptanceRate;
        const ranking=parsedData.ranking;
        const status=parsedData.status;
        const message=parsedData.message;


        console.log(totalSolved);
        updateProgress(easySolved,totalEasyQuestions, easyProgressCircle, easyLabel);
        updateProgress(mediumSolved,totalMediumQuestions, mediumProgressCircle, mediumLabel);
        updateProgress(hardSolved,totalHardQuestions, hardProgressCircle, hardLabel);
        // updateProgress(easySolved,totalEasyQuestions, easyProgressCircle, easyLabel);
        const cardsData=[
            {label:"Acceptance Rate", value:parsedData.acceptanceRate},
            {label:"Ranking", value:parsedData.ranking},
            {label:"reputation",value:parsedData.reputation},
            {label:"Contribution Points",value:parsedData.contributionPoints}
        ];
        console.log("cards data:", cardsData);

        cardStatsContainer.innerHTML=cardsData.map(
            ({label,value})=>{
                return `<div class="card">
                        <h3>${label}</h3>
                        <span>${value}</span>
                    </div>`;
            }
        ).join("");
    }
});
