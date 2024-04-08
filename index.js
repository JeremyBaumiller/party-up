console.log("hello world");
const state = {
  parties: [],
};
const API_URL =
  "https://fsa-crud-2aa9294fe819.herokuapp.com/api/2401_FTB_MT_WEB_PT/events";

const partyEl = document.querySelector("#party");
const form = document.querySelector("Form");
console.log(form);

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
  } catch (error) {
    console.error(error);
  }
  render();
}
form.addEventListener("submit", handleSubmit);

async function getEvents() {
  try {
    const response = await fetch(API_URL);
    console.log(response);
    const party = await response.json();
    console.log(party);
    state.parties = party.data;
    console.log(state);
  } catch (error) {
    alert(error);
  }
}

const render = async () => {
  await getEvents();
  if (state.parties.length) {
    const partyCards = state.parties.map((party) => {
      console.log("Creating party card for:", party);
      const partyTime = document.createElement("li");
      partytime.classList.add("box");
      const eventDate = new Date(party.date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      partyTime.innerHTML = `<h2>${party.name}</h2>
                <p>Description: ${party.description}</p>
                <p>Date: ${party.Date}</p>
                <p>Location: ${party.location}</p>
                <button class="delete-button" data-id="${party.id}">Delete</button>`;
      return partyTime;
    });

    partyTime.replaceChildren(...partyCards);

    console.log("Party cards appended to form:", partyCards);

    const deleteButtons = document.querySelectorAll(".delete-button");
    deleteButtons.forEach((button) => {
      button.addEventListener("click", async () => {
        const partyId = button.dataset.id;
        try {
          const response = await fetch(`${API_URL}/${partyId}`, {
            method: "DELETE",
          });
          if (!response.ok) {
            throw new Error("Failed to delte party");
          }
          //remove party from state
          state.parties = state.parties.filter((party) => party.id !== partyId);
          render();
        } catch (error) {
          console.error(error);
        }
      });
    });
  }
};
