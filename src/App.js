import { useState } from 'react';
import Fetch from './utilities/fetch-wrapper';
import { GoStar, GoRepoForked } from 'react-icons/go';
import './App.css';

function App() {
  const [user, setUser] = useState('');
  const [repos, setRepos] = useState([]);
  const [error, setError] = useState('');
  const API = new Fetch('https://api.github.com/');

  async function handleFormSubmit(event) {
    event.preventDefault();

    // Bail early, extra safety.
    if (!user.length > 0) {
      return;
    }

    const result = await API.get(`users/${user}/repos`).then((data) => data);

    if (Array.isArray(result)) {
      setRepos(result);
      setError('');
    } else {
      setError(result.message);
    }

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

        {error && <p className="error">It appears the user you are looking for is: {error}</p>}

        {repos.length > 0 && (
          <>
            <p>Automatically filtered by stars</p>
            <ul className="repos">
              {repos
                .sort((a, b) => b.stargazers_count - a.stargazers_count)
                .map(({ html_url, name, id, stargazers_count, forks_count, description }) => (
                  <li key={id}>
                    <a href={html_url} target="_blank" rel="noopener noreferrer" className="repo">
                      <h2 className="repo-heading">{name.replaceAll('-', ' ')}</h2>

                      {description && <p className="repo-description">{description}</p>}

                      <ul className="repo-details">
                        <li className="repo-detail">
                          <GoStar className="repo-icon" /> {stargazers_count}
                        </li>
                        <li className="repo-detail">
                          <GoRepoForked className="repo-icon" /> {forks_count}
                        </li>
                      </ul>
                    </a>
                  </li>
                ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
