import { useState } from 'react';
import Fetch from './utilities/fetch-wrapper';
import './App.css';

function App() {
  const [user, setUser] = useState('');
  const [repos, setRepos] = useState([]);
  const API = new Fetch('https://api.github.com/');

  async function handleFormSubmit(event) {
    event.preventDefault();

    // Bail early, extra safety.
    if (!user.length > 0) {
      return;
    }

    const result = await API.get(`users/${user}/repos`).then((data) => data);
    setRepos(result);
    setUser('');
  }

  function handleUserChange(event) {
    setUser(event.target.value);
  }

  return (
    <div className="app">
      <div className="row">
        <header className="header">
          <h1 className="heading">Search Repositories</h1>
        </header>

        <form onSubmit={handleFormSubmit} className="form">
          <label htmlFor="user" className="label">
            Enter GitHub User
          </label>
          <input type="text" id="user" name="user" value={user} onChange={handleUserChange} className="input" />

          <input type="submit" value="Search" className="button" disabled={user.length === 0} />
        </form>

        {repos.length > 0 && (
          <ul className="repos">
            {repos.map(({ html_url, name, id }) => (
              <li key={id}>
                <a href={html_url} target="_blank" rel="noopener noreferrer" className="repo">
                  <h2 className="repo-heading">{name.replaceAll('-', ' ')}</h2>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
