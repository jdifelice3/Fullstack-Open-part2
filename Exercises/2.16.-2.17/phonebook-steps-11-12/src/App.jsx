import { useEffect, useState, useCallback } from 'react';
import {PersonList} from './components/Person.jsx';
import axios from 'axios';
import config from './config/constants.js';
import './App.css';

const App = () => {
  console.log('API_PERSONS_URL', config.API_PERSONS_URL);
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
  ]) 
  const [newName, setNewName] = useState('');
  const [filteredPersons, setFilteredPersons] = useState([]);
  const [noSearchResults, setNoSearchResults] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    console.log('useEffect called');
    axios
      .get(config.API_PERSONS_URL)
      .then(response => {
        console.log('promise fulfilled');
        setPersons(response.data);
      })
      .catch(error => {
        showErrorMessage('Failed to fetch data from server. Please try again later.');
        console.error('Error fetching data:', error);
      });
  }, []);

  const submitOnClick = (event) => {
    event.preventDefault();
    console.log('persons', persons);
    
    console.log('button clicked', event.target)
    const name = document.getElementById('name').value;
    console.log('name', name);

    if(!name || name.length === 0) {
      alert('Name cannot be empty')
      return
    }

    if(persons.find(p => p.name === name)) {
      const addAnyway = confirm(`${name} is already added to phonebook. Replace the old number with a new one?`);
      console.log('addAnyway', addAnyway);
      switch (addAnyway) {
        case true:
          console.log(`Replacing number for ${name}`);
          const personToUpdate = persons.find(p => p.name === name);
          console.log('personToUpdate', personToUpdate);
          axios.put(config.API_PERSONS_URL + "/" + personToUpdate.id, { name, number: document.getElementById('number').value })
            .then(response => {
              console.log('response', response);
              console.log('response.data', response.data);
              setPersons(persons.map(p => p.id === personToUpdate.id ? { ...p, number: document.getElementById('number').value } : p));
              showSuccessMessage(`Updated ${name}'s number successfully!`);
            })
            .catch(error => {
              console.error('Error updating person:', error);
              showErrorMessage(`Failed to update ${name}. Please try again later.`);
            });
          break;
        case false:
          console.log(`Not replacing number for ${name}`);
          showErrorMessage(`${name} not replaced`);
          return;
        default:
          return;
      }
    } else if (!document.getElementById('number').value || document.getElementById('number').value.length === 0) {
      alert('Number cannot be empty');
      document.getElementById('number').focus();
      return
    } else {
      axios.post(config.API_PERSONS_URL, { name, number: document.getElementById('number').value })
        .then(response => {
          console.log('response', response);
          console.log('response.data', response.data);
          setPersons(persons.concat({ name, number: document.getElementById('number').value }));
          showSuccessMessage(`Added ${name} successfully!`);
          setFilteredPersons([]);
          setNoSearchResults(false);
        })
        .catch(error => {
          console.error('Error adding person:', error);
          showErrorMessage(`Failed to add  ${name}. Please try again later.`);
          setFilteredPersons([]);
          setNoSearchResults(false);
        }); 
    }
  }

  const handleRemovePerson = useCallback((personId, personName) => {
    console.log('In deleteOnClick');    
    console.log('personName', personName);  
    //Getting person id
    console.log('personId', personId);
    const userInput = confirm(`Delete ${personName}?`)
    console.log('userInput', userInput);

    if (userInput) {
      console.log(`Deleting person: ${personName}`);
      axios.delete(config.API_PERSONS_URL + "/" + personId)
      .then(response => {
        console.log('response', response);
        persons.splice(personId, 1);
        setPersons((prevPersons) => prevPersons.filter(person => person.id !== personId));
      })
      .catch(error => {
        console.error('Error deleting person:', error); 
        showErrorMessage(`Failed to delete ${personName}. Please try again later.`);
        console.error('Error deleting person:', error);
        alert('Failed to delete person. Please try again later.');
      });
    } else {
      console.log(`Deletion of person: ${personName} cancelled`);
      return;
    }
  }, []);

  const filterOnChange = (event) => {
    console.log('In filterOnChange');
    const filter = event.target.value;
    console.log('filter', filter);
    if(!filter || filter.length === 0) {
      console.log('filter is empty');
      setFilteredPersons([]);
      setNoSearchResults(false);
      return;
    }
    const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()));
    console.log('filteredPersons', filteredPersons);
    
    if(filter.length > 0 && filteredPersons.length === 0) {
      setFilteredPersons([]);
      setNoSearchResults(true);
      return;
    }
    setFilteredPersons(filteredPersons);
  }

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);
    document.getElementById('name').value = '';
    document.getElementById('number').value = '';
  } 

  const showErrorMessage = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
    document.getElementById('name').value = '';
    document.getElementById('number').value = '';
  } 

  return (
    <div>
      <h1>Phonebook</h1>
      <NotificationSuccess message={successMessage}/>
      <NotificationError message={errorMessage}/>

      <div>filter shown with <input id="filter" onChange={filterOnChange}/></div>
      
      <div><h2>add a new</h2></div>
      <form>
        <div>name: <input id="name"/></div>
        <div>number: <input id="number"/></div>
        <div><button type="submit" onClick={submitOnClick}>add</button></div>
      </form>
      <h2>Numbers</h2>
      <PersonList persons={persons} filteredPersons={filteredPersons} noSearchResults={noSearchResults} onRemove={handleRemovePerson}/>
    </div>
  )
}

const NotificationSuccess = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={'success-message'}>
      {message}
    </div>
  )
}

const NotificationError = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={'error-message'}>
      {message}
    </div>
  )
}

export default App