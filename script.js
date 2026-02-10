const countriesContainer = document.querySelector('.countries-container')
const filterByRegion = document.querySelector('.filter-by-region')
const searchInput = document.querySelector('.search-container input')
const themeChanger = document.querySelector('.theme-changer')
const showMoreBtn = document.getElementById('showMoreBtn') 

let allCountriesData = []
let randomizedCountries = [] 
let currentCount = 12;       

// 1. Fetch Data
fetch('https://restcountries.com/v3.1/all?fields=name,capital,flags,region,population')
  .then((res) => res.json())
  .then((data) => {
    allCountriesData = data
    
    // Create a random order and save it
    randomizedCountries = [...allCountriesData].sort(() => 0.5 - Math.random());
    
    // Render the first 12
    renderCountries(randomizedCountries.slice(0, currentCount));
    
    showMoreBtn.style.display = 'inline-block';
  })
  .catch((err) => {
      console.error(err);
      countriesContainer.innerHTML = `<h3 style="text-align:center">⚠️ Failed to load data.</h3>`;
  });

showMoreBtn.addEventListener('click', () => {
    const nextBatch = randomizedCountries.slice(currentCount, currentCount + 12);
    
    renderCountries(nextBatch, true);
    
    currentCount += 12;
    
    if (currentCount >= randomizedCountries.length) {
        showMoreBtn.style.display = 'none';
    }
});

function renderCountries(data, append = false) {
  if (!append) {
      countriesContainer.innerHTML = ''
  }

  data.forEach((country) => {
    const countryCard = document.createElement('a')
    countryCard.classList.add('country-card')
    countryCard.href = `country.html?name=${country.name.common}`
    
    const capitalCity = country.capital && country.capital.length > 0 ? country.capital[0] : 'N/A';
    
    countryCard.innerHTML = `
          <img src="${country.flags.svg}" alt="${country.name.common} flag" loading="lazy" />
          <div class="card-text">
              <h3 class="card-title">${country.name.common}</h3>
              <p><b>Population: </b>${country.population.toLocaleString('en-IN')}</p>
              <p><b>Region: </b>${country.region}</p>
              <p><b>Capital: </b>${capitalCity}</p>
          </div>
  `
    countriesContainer.append(countryCard)
  })
}

// 4. Search Function
searchInput.addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  
  if (searchTerm === '') {
      // If search is cleared, go back to Random View
      countriesContainer.innerHTML = '';
      currentCount = 12;
      renderCountries(randomizedCountries.slice(0, currentCount));
      showMoreBtn.style.display = 'inline-block';
  } else {
      // If searching, hide "Show More" and show ALL matches
      showMoreBtn.style.display = 'none';
      const filtered = allCountriesData.filter((c) => c.name.common.toLowerCase().includes(searchTerm));
      renderCountries(filtered);
  }
})

// 5. Filter by Region
filterByRegion.addEventListener('change', () => {
    const region = filterByRegion.value;
    // Hide "Show More" button when filtering
    showMoreBtn.style.display = 'none';
    
    fetch(`https://restcountries.com/v3.1/region/${region}?fields=name,capital,flags,region,population`)
      .then((res) => res.json())
      .then(renderCountries)
})

// 6. Theme Toggle
themeChanger.addEventListener('click', () => {
  document.body.classList.toggle('dark')
})