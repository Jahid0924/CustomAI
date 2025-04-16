let btn = document.querySelector(".button");
let input = document.querySelector(".Search");
let chat = document.querySelector(".chat-body");
let think = document.querySelector(".spinner");
let Sentence = document.querySelector(".sentences");
let Closebtn = document.querySelector(".Toggle_button");
let sidebar = document.querySelector("#sidebar");
let mainBody = document.querySelector(".main");
let menuOpen = document.querySelector(".open");
let chatHistory = document.querySelector("#history");
let newChat = document.querySelector(".new");
let cancel = document.querySelector(".cancel")
let mainTexts = document.querySelector(".massage");
let menuOpen2 = document.querySelector(".open2");
//media quary
const mediaQuery = window.matchMedia("(max-width: 500px)");

function handleScreenChange(e) {
  if (e.matches) {
    // Screen is less than or equal to 768px
    sidebar.style.width = "0px";
    Closebtn.classList.add("hide");
    menuOpen2.classList.remove("hide")
    menuOpen2.addEventListener("click", () =>{
          cancel.classList.remove("hide");
          menuOpen2.classList.add("hide");
          sidebar.style.width = "70%";
        sidebar.style.transition = "300ms ease-in-out";
        sidebar.style.zIndex ="2";
        chatHistory.style.marginLeft = "5px";
    })

    cancel.addEventListener("click", () =>{
      cancel.classList.add("hide");
      menuOpen2.classList.remove("hide");
      sidebar.style.width = "0px";
    sidebar.style.transition = "300ms ease-in-out";
    
})
  } else {
    // Screen is larger than 
    sidebar.style.width = "15%";
  }
}

// Initial check
handleScreenChange(mediaQuery);

// Listen for changes
mediaQuery.addEventListener("change", handleScreenChange);

// sidebar.style.width = "15%";

Closebtn.addEventListener("click", () => {
  let botreponse = document.querySelector(".bot");
  sidebar.style.width = "0px";

  sidebar.style.transition = "300ms ease-in-out";
  Closebtn.classList.add("hide");
  mainBody.classList.add("area");
  menuOpen.classList.remove("hide");
  try {
    botreponse.style.marginLeft = "10px";
  } catch (e) {
    console.log(e);
  }
});
menuOpen.addEventListener("click", () => {
  sidebar.style.width = "15%";

  sidebar.style.transition = "300ms ease-in-out";
  Closebtn.classList.remove("hide");
  mainBody.classList.remove("area");
  menuOpen.classList.add("hide");
});

newChat.addEventListener("click", () => {
  if (mainBody.innerHTML != null) {
    let reply = document.querySelectorAll(".massage");
    reply.forEach((idx) => {
      idx.remove();
    });
  }
});
const user_data = {
  massage: null,
};
const create_msgElement = (content, classes) => {
  const div = document.createElement("div");
  div.classList.add("massage", classes);
  div.innerHTML = content;
  return div;
};
const scroll_By = () =>
  chat.scrollTo({ top: chat.scrollHeight, behavior: "smooth" });
const typingEffect = (text, msg_Element, incomingMassage_div) => {
  msg_Element.textContent = "";
  let words = text.split(" ");
  let wordIdx = 0;
  const typing = setInterval(() => {
    if (wordIdx < words.length) {
      msg_Element.textContent += (wordIdx === 0 ? "" : " ") + words[wordIdx++];
      incomingMassage_div.classList.remove("spinner");
      scroll_By();
    } else {
      clearInterval(typing);
    }
  }, 40);
};

const API_KEY = "AIzaSyDgdUg8NDMgcPIZDHxVyy9vXgo72brcYEQ";
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

const generate_reponse = async (incomingMassage_div) => {
  const msg_Element = incomingMassage_div.querySelector(".massage-text");
  const resoption = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: user_data.massage,
            },
          ],
        },
      ],
    }),
  };
  try {
    const res = await fetch(url, resoption);
    const data = await res.json();
    const apiResponse = data.candidates[0].content.parts[0].text.replace(/\*/g, '').trim();
    msg_Element.textContent = apiResponse;

    typingEffect(apiResponse, msg_Element, incomingMassage_div);
    if (!res.ok) throw new error(data.error.contents);
  
  } catch (error) {
    console.log(error);
  }
};

const handle_userMassage = (value) => {
  user_data.massage = value.trim();
  value = " ";
  const msg_content = `<div class="massage-text"></div>`;
  const outgoingMassage_div = create_msgElement(msg_content, "user");
  outgoingMassage_div.querySelector(".massage-text").textContent =
    user_data.massage;
  chat.appendChild(outgoingMassage_div);
  scroll_By();
  setTimeout(() => {
    const msg_content = `<div class="massage-text">
                      <div class="spinner">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div> </div> </div>`;

    const incomingMassage_div = create_msgElement(msg_content, "bot");
    chat.appendChild(incomingMassage_div);
    generate_reponse(incomingMassage_div);

    scroll_By();
  }, 1000);
};
btn.addEventListener("click", () => {
  let val = input.value;
  handle_userMassage(val);
  console.log(val);
  addPrompt(val);
  input.value = " ";
  Sentence.classList.add("hide");
  Sentence.remove();
  let cursor = document.querySelector(".typed-cursor");
  cursor.remove();
});

function addPrompt(inpval) {
  const promptText = inpval.trim();

  if (promptText != "") {
    const histroyElements = document.createElement("div");
    chatHistory.appendChild(histroyElements);
    histroyElements.innerHTML = promptText;
    histroyElements.classList.add("prompt");
  }
}

///Speech recognization
const startButton = document.getElementById("voice");

// const clearButton = document.getElementById("clear");

// Constants for the language and the default language
const LANG = "en-US";

// Event listeners for the clear button
// clearButton.addEventListener("click", () => {
//   outputDiv.textContent = "";
// });

// Create a new SpeechRecognition object
const recognition = new (window.SpeechRecognition ||
  window.webkitSpeechRecognition ||
  window.mozSpeechRecognition ||
  window.msSpeechRecognition)();

// Set the language of the recognitio
recognition.lang = LANG;

// Event listeners for the recognition
recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  input.value += ` ${transcript}`;
};

// Event listeners for the start and end of the recognition
// recognition.onstart = () => startButton.textContent = "Listening...";;
// recognition.onend = () => startButton.textContent = "Start Voice Input";;
startButton.addEventListener("click", () => recognition.start());
function onLanguageChange() {
  recognition.lang = document.getElementById("language").value;
}
const pouUp = document.getElementById("popup-massage");
const poptxt = document.querySelector(".pop-up");
pouUp.addEventListener("click", () => {
  poptxt.classList.remove("hide");
  setTimeout(() => {
    poptxt.classList.add("hide");
  }, 2000);
});

//Gsap-cdn

function breakText() {
  var h1 = document.querySelector("h1");

  var h1text = h1.textContent;
  var splittext = h1text.split("");
  var halfvalue = splittext.length / 2;
  var clutter = "";

  splittext.forEach(function (element, index) {
    if (index < halfvalue) {
      clutter += `<span class="left">${element}</span>`;
    } else {
      clutter += `<span class="right">${element}</span>`;
    }
  });
  h1.innerHTML = clutter;
}
breakText();

gsap.from("h1 .left", {
  y: 80,
  opacity: 0,
  duration: 0.6,
  delay: 0.5,
  stagger: 0.15,
});
gsap.from("h1 .right", {
  y: 80,
  opacity: 0,
  duration: 0.6,
  delay: 0.5,
  stagger: -0.15,
});

//typing
 setTimeout(() =>{

   var typed = new Typed(".sentences", {
     strings: ["I am a LLM","Where Knoladge Begins", "Created By Google","Coded By Md Jahid","See Some Quotes.","Be Yourself Everyone Else is Already Taken","The Hardest Choices Require The Strongest Wills","The Toughest Climbs Have The Best Views"],
     typeSpeed:150,
     backSpeed:70,
     loop:true,
    })

},3000);
