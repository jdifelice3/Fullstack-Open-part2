import { useState, useCallback } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState(null);
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState(null);
  
  const submitOnChange = (event) => {
    event.preventDefault();
    const input = event.target.value;
    console.log('Input value:', input);
    if (input){
      axios.get(`https://restcountries.com/v3.1/name/${input}`)
      .then(response => {
        console.log('Response data:', response.data);
        console.log('Response data length:', response.data.length);
        console.log('(response.data.length > 10',(response.data.length > 10));

        if (response.data.length > 10) {
          setMessage('Too many matches, specify another filter'); 
          setCountries(null);
          setCountry(null);
        } else if (response.data.length <= 9 && response.data.length != 1 && response.data.length > 0) {
          setMessage(`Found ${response.data.length} countries:`);
          console.log('Setting countries:', response.data);
          setCountries(response.data);
          setCountry(null);
        } else if (response.data.length === 1) {
          setMessage(`Found 1 country: ${response.data[0].name.common}`);
          setCountries(null);
          setCountry(response.data[0]);
        } else {
          setMessage(`No countries found matching: ${input}`);
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setMessage(`No countries found matching: ${input}`);
      });
      //setMessage(`Searching for countries matching: ${input}`);
    } else {
        setMessage('Please enter a country name');
        setCountries([]);
        setCountry(null);
    }
  }

  const handleShowCountry = useCallback((country) => {
    console.log('In handleShowCountry');    
    console.log('country:', country);  
    setCountry(country);
    setCountries(null);
    setMessage(`Showing details for: ${country.name.common}`);  
  }, []);

  return (
    <div>
      <span>find countries:</span><input onChange={submitOnChange}/>
      <Notification message={message} />  
      <CountryList countries={countries} onShowCountry = {handleShowCountry} />
      <CountryDetails country={country} /> 
    </div>
  )
}

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={'message'}>
      {message}
      </div>
  )
}

const CountryList = ({ countries, onShowCountry }) => {
  if(countries){
    if (countries.length === 0) {
      return <div>No countries found</div>
    } else {
      return (
        <ul>
          {countries.map((country, index) => (
            <li key={index}>
              {country.name.common}
              <button onClick={() => onShowCountry(country)}>show</button>
            </li>
          ))}
        </ul>
      )
    }
  }
}

const CountryDetails = ({ country }) => {
  console.log('in CountryDetails');
  console.log('country:', country);
  if(country){
      return (
        <div>
          <h2>{country.name.common}</h2>
          <p>Capital: {country.capital}</p>
          <p>Population: {country.population}</p>
          <p>Area: {country.area} km²</p>
          <h3>Languages:</h3>
          <ul>
            {Object.values(country.languages).map((language, index) => (
              <li key={index}>{language}</li>
            ))}
          </ul>
          <img src={country.flags.png} alt={`Flag of ${country.name.common}`} width="150" />
        </div>
      )
  }
}


export default App
