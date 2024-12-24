import "./style.css";

const memeAPI = "https://api.imgflip.com/get_memes";
const errorId: HTMLElement | null = document.getElementById("error");
const topText: HTMLInputElement | null = document.getElementById(
  "input-top-text",
) as HTMLInputElement;
const bottomText: HTMLInputElement | null = document.getElementById(
  "input-bottom-text",
) as HTMLInputElement;
const goButton: HTMLButtonElement | null = document.getElementById(
  "submit",
) as HTMLButtonElement;

interface Meme {
  id: string; // The unique identifier for the meme
  name: string; // The name of the meme
  url: string; // The URL of the meme image
  width: number; // Width of the meme image
  height: number; // Height of the meme image
  box_count: number; // Number of text boxes available for the meme
}

type MemesArray = Meme[]; // An array of Meme objects

let memes: MemesArray; // Declare memes as an array of Meme objects

console.log(memeAPI);

// Clear the error message
function clearError(): void {
  if (errorId) {
    errorId.innerText = "";
  }
}

// Get the top input text
function getTopText(): string {
  if (topText) {
    return topText.value;
  }
  return "";
}

// Get the bottom input text
function getBottomText(): string {
  if (bottomText) {
    return bottomText.value;
  }
  return "";
}

// Display error if fields are empty
function handleNoTextError(): void {
  if (errorId) {
    errorId.innerText = "Please enter text in both input fields!";
  }
}

// Display error for API Request
function handleMemeError(): void {
  if (errorId) {
    errorId.innerText = "An error occured while fetching memes!";
  }
}

// Create memes using API Request
function createMemeList(): Promise<MemesArray> {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(memeAPI);
      const data = await response.json();
      if (data.success) {
        resolve(data.data.memes);
      } else {
        reject();
      }
    } catch (error) {
      reject(error);
    }
  });
}

// Select a meme at random
function selectRandomMeme(): Meme {
  const randomIndex = Math.floor(Math.random() * memes.length);
  return memes[randomIndex];
}

// Generate the HTML and CSS for a meme
function generateMeme(topText: string, bottomText: string, meme: Meme): void {
  const memeSection = document.getElementById("meme");
  memeSection!.innerHTML = "";

  // Create meme container
  const memeDiv = document.createElement("div");
  memeDiv.classList.add("meme");

  // Create and append the image
  const memeImage = document.createElement("img");
  memeImage.src = meme.url;
  memeImage.alt = "Meme Image";
  memeImage.classList.add("meme-image");
  memeDiv.appendChild(memeImage);

  // Create and append the top text
  const topTextElement = document.createElement("p");
  topTextElement.classList.add("top-text");
  topTextElement.innerText = topText;
  memeDiv.appendChild(topTextElement);

  // Create and append the bottom text
  const bottomTextElement = document.createElement("p");
  bottomTextElement.classList.add("bottom-text");
  bottomTextElement.innerText = bottomText;
  memeDiv.appendChild(bottomTextElement);

  memeSection!.appendChild(memeDiv);
}

// What to do for an event
function handleAllEvents(): void {
  clearError();
  topText!.style.border = "";
  bottomText!.style.border = "";
  let pass: boolean = true;

  if (getBottomText() === "") {
    bottomText!.style.border = "2px solid red";
    handleNoTextError();
    pass = false;
  }
  if (getTopText() === "") {
    topText!.style.border = "2px solid red";
    handleNoTextError();
    pass = false;
  }

  if (!pass) {
    return;
  }

  let selectedMeme: Meme = selectRandomMeme();
  generateMeme(getTopText(), getBottomText(), selectedMeme);
}

// Handle the event that there is a click or enter
function handleOnGoEnter(event: KeyboardEvent | MouseEvent): void {
  if (event.type === "click") {
    handleAllEvents();
  } else if (event.type === "keydown") {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.key === "Enter") {
      handleAllEvents();
    }
  }
}

createMemeList()
  .then((apiMemes: MemesArray) => {
    memes = apiMemes;
    console.log(memes);
  })
  .catch((error) => {
    console.error(error);
    handleMemeError();
  });

goButton.addEventListener("click", handleOnGoEnter);
topText.addEventListener("keydown", handleOnGoEnter);
bottomText.addEventListener("keydown", handleOnGoEnter);
