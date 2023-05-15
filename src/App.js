import './index.css';
import { useEffect, useState } from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import styles from './App.module.scss';

export default function App() {
  const [guestList, setGuestList] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // const baseUrl = 'http://localhost:4000';
  const baseUrl = 'https://1fb87be3-ae42-40dc-ba1f-6356d68c8c57.id.repl.co';

  useEffect(() => {
    setIsLoading(false);
  }, [guestList]);

  // /////////////////////////////////
  // Getting all guests
  async function getGuestList() {
    setIsLoading(true);
    const response = await fetch(`${baseUrl}/guests`);
    const allGuestsData = await response.json();
    setGuestList([...allGuestsData]);
  }
  useEffect(() => {
    getGuestList().catch((error) => console.log(error));
  }, []);

  // /////////////////////////////////
  // Creating a new guest -- POST method
  async function newGuest() {
    const response = await fetch(`${baseUrl}/guests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        attending: false,
      }),
    });
    const createdGuest = await response.json();
    const newGuestList = [...guestList, createdGuest];
    setGuestList(newGuestList);
    setFirstName('');
    setLastName('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await newGuest();
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
  // Updating a guest attendance status -- PUT method
  async function updateGuest(id, status) {
    const response = await fetch(`${baseUrl}/guests/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attending: !status }),
    });
    const updatedGuest = await response.json();
    const updatedGuestList = guestList.filter((i) => {
      return i.id !== updatedGuest.id;
    });
    setGuestList([...guestList], updatedGuestList);
    getGuestList().catch(() => console.log('Error'));
  }

  // //////////////////////////////////
  // Deleting a guest from list -- DELETE method
  function handleDeleteGuest(id) {
    const deleteGuest = async () => {
      const response = await fetch(`${baseUrl}/guests/${id}`, {
        method: 'DELETE',
      });
      const deletedGuest = await response.json();
      const currentGuestlist = [...guestList];
      const newGuestlist = currentGuestlist.filter(
        (guest) => guest.id !== deletedGuest.id,
      );
      setGuestList(newGuestlist);
    };
    deleteGuest().catch((error) => {
      console.error(error);
    });
  }

  // //////////////////////////////////

  // ////////////////

  // if (isLoading) {
  //   return 'Loading...';
  // }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formContainer}>
        <h1>🍾 Party Guest List 🎉</h1>
        {/* ==================Input====================== */}
        <form onSubmit={handleSubmit}>
          <label>
            First name
            <input
              value={firstName}
              placeholder="First name"
              disabled={isLoading}
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
              disabled={isLoading}
              onChange={(event) => {
                setLastName(event.currentTarget.value);
              }}
            />
          </label>
          <button disabled={isLoading}>Add Guest</button>
        </form>

        {/* ==================Output====================== */}
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className={styles.outputContainer}>
            {guestList.length === 0 ? (
              <p>✏️ Guest list is empty, please enter a name</p>
            ) : (
              guestList.map((guest) => (
                <div
                  className={styles.guestContainer}
                  key={`guest--${guest.id}`}
                  data-test-id="guest"
                >
                  <div>
                    <input
                      aria-label={`attenting ${guest.firstName} ${guest.lastName}`}
                      type="checkbox"
                      checked={guest.attending}
                      onChange={() => {
                        updateGuest(guest.id, guest.attending).catch((error) =>
                          console.log(error),
                        );
                      }}
                    />
                    <span>
                      {guest.attending === true ? 'attending' : 'not attending'}
                    </span>
                  </div>
                  <p>
                    {guest.firstName} {guest.lastName}
                  </p>

                  <button
                    aria-label={`Remove ${guest.firstName}${guest.lastName}`}
                    onClick={() => {
                      handleDeleteGuest(guest.id);
                    }}
                  >
                    <AiOutlineCloseCircle className={styles.closeButtonIcon} />
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
