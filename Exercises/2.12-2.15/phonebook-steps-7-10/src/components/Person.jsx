export const Person = ({ person }) => {
  return (
    <div>
      {person.name} {person.number}
    </div>
  )
}

export const PersonList = ({ persons, filteredPersons, noSearchResults }) => {
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
    <div>
      {personsToShow.map((person, index) => (
        <Person key={index} person={person} />
      ))} 
    </div>
  )
}
