import { useEffect, useState, useCallback } from 'react';
import {Person, PersonList} from './components/Person.jsx';
import axios from 'axios';

const API_PERSONS_URL = 'http://localhost:3001/persons';

const App = () => {
  console.log('API_PERSONS_URL', API_PERSONS_URL);
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
  ]) 
  const [newName, setNewName] = useState('');
  const [filteredPersons, setFilteredPersons] = useState([]);
  const [noSearchResults, setNoSearchResults] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    console.log('useEffect called');
    axios
      .get(API_PERSONS_URL)
      .then(response => {
        console.log('promise fulfilled');
        setPersons(response.data);
      })
      .catch(error => {
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
          axios.put(API_PERSONS_URL + "/" + personToUpdate.id, { name, number: document.getElementById('number').value })
            .then(response => {
              console.log('response', response);
              console.log('response.data', response.data);
              setPersons(persons.map(p => p.id === personToUpdate.id ? { ...p, number: document.getElementById('number').value } : p));
            })
            .catch(error => {
              console.error('Error updating person:', error);
              alert('Failed to update person. Please try again later.');
            });
          break;
        case false:
          console.log(`Not replacing number for ${name}`);
          alert(`${name} not replaced`);
          document.getElementById('name').value = '';
          document.getElementById('number').value = '';
          return;
        default:
          return;
      }
    } else if (!document.getElementById('number').value || document.getElementById('number').value.length === 0) {
      alert('Number cannot be empty');
      document.getElementById('number').focus();
      return
    } else {
      axios.post(API_PERSONS_URL, { name, number: document.getElementById('number').value })
        .then(response => {
          console.log('response', response);
          console.log('response.data', response.data);
          setPersons(persons.concat({ name, number: document.getElementById('number').value }));
        })
        .catch(error => {
          console.error('Error adding person:', error);
          alert('Failed to add person. Please try again later.');
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
      axios.delete(API_PERSONS_URL + "/" + personId)
      .then(response => {
        console.log('response', response);
        persons.splice(personId, 1);
        setPersons((prevPersons) => prevPersons.filter(person => person.id !== personId));
      })
      .catch(error => {
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

  return (
    <div>
      <h1>Phonebook</h1>
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

export default App