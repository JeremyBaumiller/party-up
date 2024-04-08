document.addEventListener("DOMContentLoaded", function () {
  console.log("hello world");
  const state = {
    parties: [],
  };
  const API_URL =
    "https://fsa-crud-2aa9294fe819.herokuapp.com/api/2401_FTB_MT_WEB_PT/events";
  const partyList = document.getElementById("party");
  const form = document.querySelector("form");

  async function handleSubmit(event) {
    event.preventDefault();
    const title = event.target.title.value;
    const date = event.target.date.value;
    const location = event.target.location.value;
    const description = event.target.description.value;
    const data = {
      name: title,
      date: new Date(date),
      location: location,
      description: description,
    };
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.error) {
        console.log(result.error);
        throw new Error(result.error.message);
      }
      render();
    } catch (error) {
      console.error(error);
    }
  }

  if (form) {
    form.addEventListener("submit", handleSubmit);
  }

  async function getEvents() {
    try {
      const response = await fetch(API_URL);
      const party = await response.json();
      state.parties = party.data;
    } catch (error) {
      alert(error);
    }
  }

  const render = async () => {
    await getEvents();
    if (state.parties.length) {
      const partyCards = state.parties.map((party) => {
        console.log("Creating party card for:", party);
        const partyEl = document.createElement("li");
        partyEl.classList.add("box");
        const eventDate = new Date(party.date).toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        partyEl.innerHTML = `<h2>${party.name}</h2>
                    <p>Description: ${party.description}</p>
                    <p>Date: ${eventDate}</p>
                    <p>Location: ${party.location}</p>
                    <button class="delete-button" data-id="${party.id}">Delete</button>`;
        return partyEl;
      });

      partyList.replaceChildren(...partyCards);

      const deleteButtons = document.querySelectorAll(".delete-button");
      deleteButtons.forEach((button) => {
        button.addEventListener("click", async () => {
          const partyId = button.dataset.id;
          try {
            const response = await fetch(`${API_URL}/${partyId}`, {
              method: "DELETE",
            });
            if (!response.ok) {
              throw new Error("Failed to delete party");
            }
            // Remove party from state
            state.parties = state.parties.filter(
              (party) => party.id !== partyId
            );
            render();
          } catch (error) {
            console.error(error);
          }
        });
      });
    }
  };
  render();

  // New code for adding parties from the API
  const partyForm = document.getElementById("party-form");
  partyForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(partyForm);
    const name = formData.get("name");
    const date = formData.get("date");
    const location = formData.get("location");
    const description = formData.get("description");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          date,
          location,
          description,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add party");
      }

      await render(); // Refresh the party list after adding the new party
      partyForm.reset(); // Reset the form fields
    } catch (error) {
      console.error(error);
    }
  });
});
