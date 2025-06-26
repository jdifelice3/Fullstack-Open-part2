import axios from "axios";
const API_PERSONS_URL = 'http://localhost:3001/persons';

export const Person = ({ person }) => {
  return (
    <span id={person.id}>
      {person.name} {person.number}
    </span>
  )
}

export const PersonList = ({ persons, filteredPersons, noSearchResults, onRemove }) => {
  console.log('PersonList persons', persons);
  if (noSearchResults) {
    return <div>No search results found</div>
  } 
  
  let personsToShow = []
  if (!filteredPersons || filteredPersons.length === 0) {
      personsToShow = persons;
  } else {
      personsToShow = filteredPersons;
  }
  
  return (
    <div className="container">
      {personsToShow.map((person, index) => (
        <div className="person-item" key={index}>
          <Person key={index} person={person} /><button onClick={() => onRemove(person.id, person.name)}>delete</button>
        </div>
      ))}   
      </div>
  )
}
