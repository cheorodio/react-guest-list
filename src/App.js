import './index.css';
import { useEffect, useState } from 'react';
import styles from './App.module.scss';

export default function App() {
  const [guestList, setGuestList] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const baseUrl = 'http://localhost:4000';

  // /////////////////////////////////
  // get all guests from api link
  useEffect(() => {
    async function getGuestList() {
      const response = await fetch(`${baseUrl}/guests`);
      const alGuestsData = await response.json();
      setGuestList([alGuestsData.results[0]]);
    }
    getGuestList().catch((error) => {
      console.log(error);
    });
  }, []);

  // create a new guest and save to baseUrl
  async function newGuest() {
    const response = await fetch(`${baseUrl}/guests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firstName: firstName, lastName: lastName }),
    });
    const createdGuest = await response.json();
    return createdGuest;
  }

  async function handleSubmit(event) {
    await newGuest();
    event.preventDefault();
  }

  // /////////////////////////////////
  // Change focus to the next input field when you hit return
  const handleEnter = (event) => {
    if (event.key.toLowerCase() === 'enter') {
      const form = event.target.form;
      const index = [...form].indexOf(event.target);
      form.elements[index + 1].focus();
      event.preventDefault();
    }
  };
  // //////////////////////////////////

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h1>Guest List</h1>

        {/* Input */}
        <form data-test-id="guest" onSubmit={handleSubmit}>
          <label>
            First name
            <input
              value={firstName}
              placeholder="First name"
              onKeyDown={handleEnter}
              onChange={(event) => {
                setFirstName(event.currentTarget.value);
              }}
            />
          </label>
          <label>
            Last name
            <input
              value={lastName}
              placeholder="Last name"
              onChange={(event) => {
                setLastName(event.currentTarget.value);
              }}
            />
          </label>
          <button>Add Guest</button>
        </form>
      </div>
    </div>
  );
}
