const url =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false";
const searchResults = document.getElementById("search-results");
const searchInput = document.getElementById("search-input");
let dataArray = [];

//---Helper Functionality used while testing----//
// function fetchFromLocalStorage() {
//   dataArray = JSON.parse(localStorage.getItem("data"));
//   populateSearchResults(dataArray);
// }
// fetchFromLocalStorage();

//--Fetch data from api--//

async function fetchData() {
  const response = await fetch(url);
  response.json().then((data) => {
    dataArray = [...data];
    populateSearchResults(data);
    localStorage.setItem("data", JSON.stringify(data));
  });
}
fetchData();

//-----Populate UI------//

function populateSearchResults(dataArray) {
  searchResults.innerHTML = "";
  dataArray.forEach((item) => {
    const totalVolume = addComma(item.total_volume);
    const marketCap = addComma(item.market_cap);
    let color;
    if (item.market_cap_change_percentage_24h > 0) {
      color = "green";
    } else {
      color = "red";
    }
    const table = document.createElement("table");
    table.innerHTML = `
        <tr>
              <td class="name">
                <img src="${item.image}" />
                ${item.name}
              </td>
              <td>${item.symbol.toUpperCase()}</td>
              <td>$${item.current_price}</td>
              <td>$${totalVolume}</td>
              <td style="color:${color}">${item.market_cap_change_percentage_24h.toFixed(
      2
    )}%</td>
              <td class="market-cap">Mkt Cap $${marketCap}</td>
            </tr>
          `;
    searchResults.appendChild(table);
  });
}

//---Helper Function---//

function addComma(number) {
  if (number < 1000) {
    return;
  }
  const arr = [];
  while (number > 1000) {
    arr.unshift(number % 1000);
    number = Math.floor(number / 1000);
  }
  while (number > 0) {
    arr.unshift(number % 100);
    number = Math.floor(number / 100);
  }
  const str = arr.join(",");
  return str;
}

//------Sort Functions-------//

function sortByMarketCap() {
  dataArray.sort((a, b) => {
    const x = +a.market_cap;
    const y = +b.market_cap;
    return y - x;
  });
  populateSearchResults(dataArray);
}
function sortByPercentage() {
  dataArray.sort((a, b) => {
    return (
      +b.market_cap_change_percentage_24h - +a.market_cap_change_percentage_24h
    );
  });
  populateSearchResults(dataArray);
}

//-------Search Function-------//
function search(term) {
  const resultArr = dataArray.filter((item) => {
    const str =
      item.name +
      item.current_price +
      item.total_volume +
      item.market_cap +
      item.market_cap_change_percentage_24h +
      item.logo;
    return str.toUpperCase().indexOf(term) > -1;
  });
  populateSearchResults(resultArr);
}

//---Search Input Listener----//

searchInput.addEventListener("input", (e) => {
  search(e.target.value.toUpperCase());
});
