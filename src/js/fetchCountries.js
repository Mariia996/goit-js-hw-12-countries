import { error } from '@pnotify/core';
import '@pnotify/core/dist/BrightTheme.css';
import _ from 'lodash';

import createCountryList from '../templates/countries.hbs';
import createCountryCard from '../templates/country-card.hbs';

const inputRef = document.getElementById('name-country');
const countryContRef = document.getElementById('dynamic-container');

const basicUrl = 'https://restcountries.eu/rest/v2';

inputRef.addEventListener('input',  _.debounce(function (e) {
    e.preventDefault();

    const userCountry = this.value;
    if (!userCountry) {
        countryContRef.innerHTML = "";
        return;
    }
    foundCountryRequest(userCountry);
}, 500));

function foundCountryRequest(country) {
    const userRequest = fetch(`${basicUrl}/name/${country}`);

    userRequest
        .then(response => {
            if (!response.ok || response.status === 404) {
                throw new Error(response.statusText);
            }
            return response.json();
        })
        .then(createCountryHandler)
        .catch(function () {
            countryContRef.innerHTML =
                `<p class="error-notification">Country was not found. Please, try again.</p>`;
            });
}

function createCountryHandler(item) {
            if (item.length >= 2 && item.length <= 10) {
                countryContRef.innerHTML = createCountryList(item);

            } else if (item.length === 1) {
                const markup = createCountryCard(...item);
                countryContRef.innerHTML = markup;


            } else if (item.length > 10) {
                countryContRef.innerHTML = '';

                error({
                    text: "Too many matches found. Please entry a more specific query!",
                    styling: 'brighttheme',
                    icon: true,
                    addClass: 'error-message',
                    delay: 700,
                    hide: true,
                });
                const pnotify = document.querySelector(".pnotify");
                countryContRef.append(pnotify);
             }
}
