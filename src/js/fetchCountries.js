
import { error } from '@pnotify/core';
import '@pnotify/core/dist/BrightTheme.css';
import _ from 'lodash';

import createCountryList from '../templates/countries.hbs';
import createCountryCard from '../templates/country-card.hbs';

const inputRef = document.getElementById('name-country');
// const countryListRef = document.getElementById('countries-list');
const countryContRef = document.getElementById('dynamic-container');

const basicUrl = 'https://restcountries.eu/rest/v2';


inputRef.addEventListener('input',  _.debounce(function (e) {
    e.preventDefault();

    const userCountry = e.target.value;
    foundCountryRequest(userCountry);
}, 500));



function foundCountryRequest(country) {
    const userRequest = fetch(`${basicUrl}/name/${country}`);

    userRequest
        .then(response => {
            if (!response.ok) {
                throw new Error("Error!");
            }
            return response.json();
        })
        .then(item => {

             if (item.length >= 2 && item.length <= 10) {
                countryContRef.innerHTML = createCountryList(item);

            } else if (item.length === 1) {
                const markup = createCountryCard(...item);
                countryContRef.innerHTML = markup;


            } else if (item.length > 10) {
            countryContRef.innerHTML = '';

                const myError = error({
                    text: "Too many matches found. Please entry a more specific query!",
                    styling: 'brighttheme',
                    delay: 1000,
                    hide: true,
                    shadow: true,
                    context: countryContRef,
                });

            }
        })
        .catch(error => { countryContRef.innerHTML = `<p class="error-notification">Please, try again.</p>`; });

}