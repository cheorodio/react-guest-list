import './index.css';
import { useEffect, useState } from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import styles from './App.module.scss';

export default function App() {
  const [guestList, setGuestList] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const baseUrl = 'http://localhost:4000';

  // /////////////////////////////////
  // Getting all guests
  async function getGuestList() {
    const response = await fetch(`${baseUrl}/guests`);
    const allGuestsData = await response.json();
    setGuestList(allGuestsData);
    setIsLoading(false);
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
    getGuestList().catch(() =>
      console.log('changing attendance status went wrong'),
    );
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

  useEffect(() => {
    if (guestList.length > 0) {
      setIsLoading(false);
    }
  }, [guestList]);

  // //////////////////////////////////

  // if (isLoading) {
  //   return 'Loading...';
  // }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formContainer} data-test-id="guest">
        <h1>🍾 Party Guest List 🎉</h1>
        {isLoading ? <div>Loading...</div> : ''}
        {/* Input */}
        <form
          data-test-id="guest"
          onSubmit={handleSubmit}
          disabled={!isLoading}
        >
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
          <button>Add Guest</button>
        </form>

        {/* Output */}
        <div className={styles.outputContainer} data-test-id="guest">
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
                  aria-label={`remove ${guest.firstName}${guest.lastName}`}
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
      </div>
      {/* <div className={styles.bottomContainer}>
          <button>Clear Guest List </button>
          <button>Show Attending Guests</button>
          <button>Show Non-Attending Guests</button>
          <button>Reset Filter</button>
        </div> */}
    </div>
  );
}
