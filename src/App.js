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
  // get all guests
  useEffect(() => {
    async function getGuestList() {
      const response = await fetch(`${baseUrl}/guests`);
      const allGuestsData = await response.json();
      setGuestList(allGuestsData);
      setIsLoading(false);
    }
    getGuestList().catch((error) => {
      console.log(error);
    });
  }, []);

  // /////////////////////////////////
  // Creating a new guest using POST method
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
  // Updating a guest attendance status using PUT method
  async function updateGuest(id) {
    const response = await fetch(`${baseUrl}/guests/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attending: true }),
    });
    const updatedGuest = await response.json();
    return updatedGuest;
  }

  // //////////////////////////////////
  // Deleting a guest using DELETE method
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

  if (isLoading) {
    return 'Loading ...';
  } else {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.formContainer} data-test-id="guest">
          <h1> 🍾 Party Guest List 🎉</h1>
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
          {/* Output */}
          <div className={styles.outputContainer} data-test-id="guest">
            {guestList.map((guest) => {
              return (
                <div
                  className={styles.guestContainer}
                  key={`guest--${guest.id}`}
                >
                  <div>
                    <input
                      aria-label="Attending"
                      type="checkbox"
                      onChange={async () => {
                        await updateGuest();
                      }}
                    />
                    <span>
                      {guest.attending === 'true'
                        ? 'attending'
                        : 'not attending'}
                    </span>
                  </div>
                  <p>
                    {guest.firstName} {guest.lastName}
                  </p>

                  <button
                    aria-label="Remove"
                    onClick={() => {
                      handleDeleteGuest(guest.id);
                    }}
                  >
                    <AiOutlineCloseCircle className={styles.closeButtonIcon} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        <div className={styles.bottomContainer}>
          <button>Clear Guest List </button>
          <button>Show Attending Guests</button>
          <button>Show Non-Attending Guests</button>
          <button>Reset Filter</button>
        </div>
      </div>
    );
  }
}
