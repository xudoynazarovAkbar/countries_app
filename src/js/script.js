// _____________________ Home Scroll _______________________
const homeLink = document.querySelector('a[href="/"]');
homeLink.addEventListener('click', (e) => {
	e.preventDefault();
	window.scrollTo({ top: 0, behavior: 'smooth' });
});

// _____________________ Night Mode _______________________
const pageWrapper = document.querySelector('.page-wrapper');
const nightModeBtn = document.querySelector('.header__night-mode');
const nightModeText = document.querySelector('.night-mode__text');

nightModeBtn.addEventListener('click', () => {
	pageWrapper.classList.toggle('night');
	nightModeText.textContent = pageWrapper.classList.contains('night') ? 'Dark Mode' : 'Light Mode';
});

// _____________________ State Variables _______________________
let filteredRegion = '/all';  // current region filter
let searchQuery = '';          // current search input
let searchTimeout = null;

const countriesSection = document.querySelector('.countries__inner');

// _____________________ Search Input _______________________
const searchInput = document.getElementById('country-name');
const inputCancelBtn = document.getElementById('input-cancel');

searchInput.addEventListener('input', () => {
	const allowedChars = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM-' ";
	let value = searchInput.value.trimStart();
	let newValue = '';
	for (let char of value) if (allowedChars.includes(char)) newValue += char;
	searchInput.value = newValue.trimStart();
	inputCancelBtn.classList.toggle('active', newValue.length > 0);

	clearTimeout(searchTimeout);
	searchTimeout = setTimeout(() => {
		searchQuery = newValue;
		updateFilteredData();
	}, 500);
});

inputCancelBtn.addEventListener('click', () => {
	searchInput.value = '';
	inputCancelBtn.classList.remove('active');
	searchInput.focus();
	searchQuery = '';
	updateFilteredData();
});

// _____________________ Filter _______________________
const filterTrigger = document.querySelector(".filter__trigger");
const filterOptions = document.querySelector('.filter__options');
const filterValue = document.querySelector(".filter__trigger .filter__value");
const cancelFilter = document.getElementById('cancel-filter');
const dropDown = document.getElementById('drop-down');
const featuresFilter = document.querySelector(".features__filter");

filterTrigger.addEventListener('click', () => {
	featuresFilter.classList.toggle("open");
});

filterOptions.addEventListener('click', (e) => {
	const region = e.target.dataset.region;
	if (!region) return;
	filterValue.textContent = region;
	featuresFilter.classList.remove('open');
	cancelFilter.classList.remove('hide');
	dropDown.classList.add('hide');
	filteredRegion = `/region/${region}`;
	updateFilteredData();
});

cancelFilter.addEventListener('click', (e) => {
	e.stopPropagation();
	filterValue.textContent = "Filter by Region";
	cancelFilter.classList.add('hide');
	dropDown.classList.remove('hide');
	filteredRegion = '/all';
	updateFilteredData();
});

document.addEventListener("click", (e) => {
	if (!featuresFilter.contains(e.target)) {
		featuresFilter.classList.remove("open");
	}
});

// _____________________ Modal _______________________
const modal = document.querySelector('.modal');
const modalCountry = document.querySelector('.modal-country');

// _____________________ Update Filtered Data _______________________
function updateFilteredData() {
	if (filteredRegion !== '/all') {
		fetchData(filteredRegion, searchQuery);
	} else if (searchQuery) {
		fetchData(`/name/${searchQuery}`);
	} else {
		fetchData('/all');
	}
}

// _____________________ Fetch Data _______________________
function fetchData(url, searchTerm = '') {
	const apiBase = "https://restcountries.com/v3.1";
	const fields = "fields=name,flags,population,region,subregion,capital,tld,borders,languages,currencies";

	countriesSection.innerHTML = '';
	modal.classList.add('open'); // loader

	fetch(`${apiBase}${url}?${fields}`)
		.then(response => {
			if (!response.ok) throw new Error();
			return response.json();
		})
		.then(data => {
			modal.classList.remove('open');
			if (!data.length) throw new Error();
			countriesSection.style.display = 'grid';

			if (searchTerm) {
				data = data.filter(c => c.name?.common.toLowerCase().includes(searchTerm.toLowerCase()));
			}

			if (!data.length) {
				countriesSection.innerHTML = `<h2 class="countries__error">No results were found</h2>`;
				countriesSection.style.display = 'block';
				return;
			}

			data.forEach(country => renderCountriesItem(renderObject(country)));
		})
		.catch(() => {
			modal.classList.remove('open');
			countriesSection.innerHTML = `<h2 class="countries__error">No results were found</h2>`;
			countriesSection.style.display = 'block';
		});
}

// _____________________ Render Helpers _______________________
function renderObject(country) {
	return {
		flag: country.flags?.png || '',
		alt: country.flags?.alt || '',
		name: country.name?.common || '',
		population: country.population || 0,
		region: country.region || '',
		subregion: country.subregion || '',
		capital: country.capital || [],
		tld: country.tld?.length === 1 ? country.tld[0] : country.tld || [],
		currencies: country.currencies ? Object.values(country.currencies).map(c => c.name) : [],
		languages: country.languages ? Object.values(country.languages) : [],
		borders: country.borders || []
	};
}

function renderCountriesItem(obj) {
	const item = document.createElement('div');
	item.classList.add('countries__item', 'item');
	item.dataset.country = JSON.stringify(obj);
	item.innerHTML = `
		<div class="item__img">
			<img src="${obj.flag}" alt="${obj.alt}">
		</div>
		<div class="item__info info">
			<div class="info__title">${obj.name}</div>
			<div class="info__secondary">
				<span class="info__key">Population: </span>
				<span class="info__value">${obj.population.toLocaleString()}</span>
			</div>
			<div class="info__secondary">
				<span class="info__key">Region: </span>
				<span class="info__value">${obj.region}</span>
			</div>
			<div class="info__secondary">
				<span class="info__key">Capital: </span>
				<span class="info__value">${obj.capital.join(', ')}</span>
			</div>
		</div>
	`;
	countriesSection.append(item);
}

// _____________________ Render Modal _______________________
function renderModal(obj) {
	const flagEl = modalCountry.querySelector('.content-modal__flag');
	const infoEl = modalCountry.querySelector('.content-modal__info');

	flagEl.innerHTML = `<img src="${obj.flag}" alt="${obj.alt}">`;
	infoEl.innerHTML = `
    <h2 class="info__title info__title-modal">${obj.name}</h2>
    <div class="info__wrapper">
      <div>
        <div class="info__secondary"><span class="info__key">Native Name: </span><span class="info__value">${obj.name}</span></div>
        <div class="info__secondary"><span class="info__key">Population: </span><span class="info__value">${obj.population.toLocaleString()}</span></div>
        <div class="info__secondary"><span class="info__key">Region: </span><span class="info__value">${obj.region}</span></div>
        <div class="info__secondary"><span class="info__key">Sub Region: </span><span class="info__value">${obj.subregion}</span></div>
        <div class="info__secondary"><span class="info__key">Capital: </span><span class="info__value">${obj.capital.join(', ')}</span></div>
      </div>
      <div>
        <div class="info__secondary"><span class="info__key">Top Level Domain: </span><span class="info__value">${Array.isArray(obj.tld) ? obj.tld.join(', ') : obj.tld}</span></div>
        <div class="info__secondary"><span class="info__key">Currencies: </span><span class="info__value">${obj.currencies.length ? obj.currencies.join(', ') : 'None'}</span></div>
        <div class="info__secondary"><span class="info__key">Languages: </span><span class="info__value">${obj.languages.length ? obj.languages.join(', ') : 'None'}</span></div>
      </div>
    </div>
    <div class="info__borders">
      <div class="info__secondary info__secondary-borders">
        <span class="info__key">Border Countries: </span>
        <span class="info__value">${obj.borders.length ? obj.borders.map(border => `<span>${border}</span>`).join('') : 'None'}</span>
      </div>
    </div>
  `;
}

// _____________________ Country Click & Modal _______________________
countriesSection.addEventListener('click', (e) => {
	const card = e.target.closest('.countries__item');
	if (!card) return;
	const obj = JSON.parse(card.dataset.country);
	renderModal(obj);
	modalCountry.classList.add('open');
	document.body.style.overflow = 'hidden';
});

modalCountry.addEventListener('click', (e) => {
	if (e.target.closest('.modal-country__close') || e.target.matches('.modal-country__background')) {
		modalCountry.classList.remove('open');
		document.body.style.overflow = '';
	}
});


updateFilteredData()
