let responses = [];

const fetchUserResponses = async() => {
  const response = await fetch("https://cors-anywhere.herokuapp.com/https://docs.google.com/spreadsheets/d/e/2PACX-1vTpLEEA4DzfwuQeeg69HtnM251frycIYrSTr6ff6B42cfH3TegMdRmtoDfBRo4EzqtXv26zO24mS8_O/pub?output=csv");
  const data = await response.text();
  const results = Papa.parse(data, {header: true});
  responses = results.data;
}

const fetchAndShowResponses = async() => {
  await fetchUserResponses();

  const eachUserResponseHTML = responses.map(renderUserResponse);
  const allUsersResponseHTML = eachUserResponseHTML.join('');
  document.querySelector("#user-responses").innerHTML = allUsersResponseHTML;
  renderChart(1); //number 1, 2, 3 to top genre choice
}

function renderChart(ranking) {
  let key = '';
  switch (ranking) {
    case 2:
      key = "Please select your top 3 film genres [Second choice]";
      break;
    case 3:
      key = "Please select your top 3 film genres [Third choice]";
      break;
    default:
      key = "Please select your top 3 film genres [Top choice]";
      break;
  }
  const genreCount = {
    "Action": 0,
    "Comedy": 0,
    "Drama": 0,
    "Fantasy/Sci-Fi": 0,
    "Horror/Thriller": 0,
    "Mystery": 0,
    "Romance": 0,
  }

  responses.forEach(response => {
  genreCount[response[key]] += 1;
  })
  
   
  new Chart("doughnut", {
    type: 'doughnut',
    data: {
      datasets: [{
        data: Object.values(genreCount),
        backgroundColor: ["darkred", "gold", "green", "lightblue", "black", "purple", "pink"]
      }],
      labels: Object.keys(genreCount)
    },
    options: {
      title: {
        display: true,
        text: `No. ${ranking} Genre of Respondents`,
        fontFamily: "Source Sans Pro",
        fontSize: "18"
      },
      legend: {
        display: true,
        position: "right"
      }
    }

  });
}

function renderUserResponse(userResponse) {
  const sportsFormat = userResponse["How do you consume live sports content?"];
  const payFee = userResponse["How likely are you to pay an additional one-time fee to view cinematic releases (A-list films) on a streaming service (e.g. Mulan on Disney+, or TENET wherever Christopher Nolan decides to release it)?"];
  const oscarViewedList = userResponse["Please select all the Academy Award Best Picture winners from the last 10 years you have seen:"];
  const genre1 = userResponse["Please select your top 3 film genres [Second choice]"];
  const genre2 = userResponse["Please select your top 3 film genres [Third choice]"];
  const genre3 = userResponse["Please select your top 3 film genres [Top choice]"];
  const oldLink = userResponse["Please upload a poster/screenshot/photo of your answer to the question above:"].split("id=")[1];
  const imageLink = "https://drive.google.com/thumbnail?id=" + oldLink;
  const filmChoice = userResponse["What is your favourite underrated or overlooked film?"];
  const userName = userResponse["What is your name?"];
  const streamingService = userResponse["Which of the following streaming services do you use the most lately?"];

  const applelogo = "https://drive.google.com/thumbnail?id=1tcAKEmQgUMWmmcMPHYc-KvigkNXuu2Ff";
  const hululogo = "https://drive.google.com/thumbnail?id=1qkvLGM8bi3kHmiqJfcHPojJND_gXv8pL";
  const amazonlogo = "https://drive.google.com/thumbnail?id=1G4b8rkcOH3SMpvgsGGxI26G6Dg_bpssT";
  const disneylogo = "https://drive.google.com/thumbnail?id=1cuhNjwMOXM2C84q5EbuPf6lUCGq28DIk/";
  const hbologo = "https://drive.google.com/thumbnail?id=1YLfEJl75gy7-EkJ6r4lsURV2ELdcpADs";
  const netflixlogo = "https://drive.google.com/thumbnail?id=1ZSZFzeWmyQ-Yb02Bu9ljSadkOOIq71Vg";

  let streamUrl;
  let willPayFee;

  switch (streamingService) {
    case "Netflix":
      streamUrl = netflixlogo;
      break;
    case "Amazon Prime Video":
      streamUrl = amazonlogo;
      break;
    case "Hulu":
      streamUrl = hululogo;
      break;
    case "HBO Max":
      streamUrl = hbologo;
      break;
    case "Disney+":
      streamUrl = disneylogo;
      break;
    case "Apple TV+":
      streamUrl = applelogo;
      break;
    default:
      streamUrl = "";
  }
 
  switch (payFee) {
    case "1":
      willPayFee = "very unlikely";
      break;
    case "2":
      willPayFee = "somewhat unlikely";
      break;
    case "3":
      willPayFee = "neither likely nor unlikely";
      break;
    case "4":
      willPayFee = "somewhat likely";
      break;
    case "5":
      willPayFee = "very likely";
      break;
    }
  return `
    <div class="outer">
    <div class="card">
      <div class="user-name">
        <h2>${userName}</h2>
      </div>
      <div class="photo">
        <img src="${imageLink}" alt="${filmChoice}" />
      </div>
      <div class="film-title">
        <p>Underrated or overlooked film suggestion:</p>
        <h3>${filmChoice}</h3>
      </div>
      <div class="general1">
        <h4>Top Genres:</h4>
      </div>
      <div class="general2">
        <p>1. ${genre1}</p>
        <p>2. ${genre2}</p>
        <p>3. ${genre3}</p>
      </div>
      <div class="stats1">
        <p>Likeliness to pay additional fee to stream cinematic releases:</p>
        <p>${willPayFee}</p>
      </div>
      <div class="other">
        <h6>10-year Best Picture Checklist: </h6>
        <p>${oscarViewedList}</p>
      </div>
      <div class="stats2"> 
        <img class="logo" src="${streamUrl}" alt="${streamingService}" />
      </div>
    </div>
    </div>
    `;
}

fetchAndShowResponses();

const filterSection = document.querySelector('#filters');
const searchInput = document.querySelector('#search');
const genreSelect = document.querySelector('#genres');
const hideButton = document.querySelector('#stats-button')
const rankingSelect = document.querySelector('#ranking');

function resultFilter(userResponse) {
  const selectedGenre = genreSelect.value.toLowerCase();
  const searchTerm  = searchInput.value.toLowerCase();
  const sportsFormat = userResponse["How do you consume live sports content?"];
  const oscarViewedList = userResponse["Please select all the Academy Award Best Picture winners from the last 10 years you have seen:"];
  const genre1 = userResponse["Please select your top 3 film genres [Second choice]"];
  const genre2 = userResponse["Please select your top 3 film genres [Third choice]"];
  const genre3 = userResponse["Please select your top 3 film genres [Top choice]"];
  const filmChoice = userResponse["What is your favourite underrated or overlooked film?"];
  const userName = userResponse["What is your name?"];
  const streamingService = userResponse["Which of the following streaming services do you use the most lately?"];
  
  return ((userName.toLowerCase().includes(searchTerm) || oscarViewedList.toLowerCase().includes(searchTerm)) &&
          (genre1.toLowerCase() === selectedGenre ||
          genre2.toLowerCase() === selectedGenre ||
          genre3.toLowerCase() === selectedGenre ||
          selectedGenre === "all")
          )
}

function handleFilterInput() {
  const filteredResults = responses.filter(resultFilter);
  document.querySelector("#user-responses").innerHTML = filteredResults.map(renderUserResponse).join('');
}

function handleHideClick() {
  document.querySelector('#summary-stats').classList.toggle("hidden");
}

function handleRankingInput() {
  renderChart(Number(rankingSelect.value));
}

searchInput.addEventListener('input', handleFilterInput);
genreSelect.addEventListener('input', handleFilterInput);
hideButton.addEventListener('click', handleHideClick);
rankingSelect.addEventListener('input', handleRankingInput);
