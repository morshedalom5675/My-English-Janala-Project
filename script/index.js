const createElement = (arr) => {
  const htmlElement = arr.map(
    (el) => `<span class = "btn bg-[#1A91FF10]">${el}</span>`
  );
  return htmlElement.join(" ");
};

function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

const levelBtn = () => {
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res) => res.json())
    .then((json) => displayBtn(json.data));
};

const removeActive = () => {
  const lessonButtons = document.querySelectorAll(".lesson-btn");
  lessonButtons.forEach((btn) => {
    btn.classList.remove("active");
  });
};

const levelBtnWord = (id) => {
  manageSpinner(true);
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const clickBtn = document.getElementById(`lesson-btn-${id}`);
      removeActive();
      clickBtn.classList.add("active");
      displayBtnWord(data.data);
    });
};

const manageSpinner = (status) => {
  if (status == true) {
    document.getElementById("spinner").classList.remove("hidden");
    document.getElementById("word-container").classList.add("hidden");
  } else {
    document.getElementById("word-container").classList.remove("hidden");
    document.getElementById("spinner").classList.add("hidden");
  }
};

const loadWordDetail = async (id) => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`;
  const res = await fetch(url);
  const details = await res.json();
  displayWordDetails(details.data);
};
// {
//     "word": "Cautious",
//     "meaning": "সতর্ক",
//     "pronunciation": "কশাস",
//     "level": 2,
//     "sentence": "Be cautious while crossing the road.",
//     "points": 2,
//     "partsOfSpeech": "adjective",
//     "synonyms": [
//         "careful",
//         "alert",
//         "watchful"
//     ],
//     "id": 3
// }

const displayWordDetails = (word) => {
  const wordContainer = document.getElementById("modal-container");
  wordContainer.innerHTML = `
    <div class="text-2xl font-bold">
            <h1>${word.word} (<i class="fa-solid fa-microphone-lines"></i> :${
    word.pronunciation
  })</h1>
        </div>
        <div>
            <h1 class="font-semibold mb-2">Meaning</h1>
            <p>${word.meaning}</p>
        </div>
        <div>
            <h1 class="font-semibold mb-2">Example</h1>
            <p>${word.sentence}</p>
        </div>
        <div>
            <h1 class="font-semibold mb-2">সমার্থক শব্দ গুলো</h1>
             <div>${createElement(word.synonyms)}</div>  
        </div>
    `;
  document.getElementById("word_modal").showModal();
};

const displayBtnWord = (words) => {
  const wordContainer = document.getElementById("word-container");
  wordContainer.innerHTML = "";

  if (words.length == 0) {
    wordContainer.innerHTML = `
        <div class="text-center col-span-full py-10 space-y-4">
                <img class="mx-auto" src="./assets/alert-error.png" alt="">
                <p class="text-gray-500">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
                <h2 class="text-4xl">নেক্সট Lesson এ যান</h2>
            </div>
        
        `;
  }
  words.forEach((word) => {
    const newDiv = document.createElement("div");
    newDiv.innerHTML = `
        <div class="bg-white text-center justify-center rounded-lg shadow-lg m-4 py-10 px-5 space-y-4">
                <h2 class="text-2xl font-bold">${
                  word.word ? word.word : "কোন শব্দ পাওয়া যায়নি"
                }</h2>
                <p class="font-medium">Meaning /Pronounciation</p>
                <h2 class="text-xl font-semibold">${
                  word.meaning ? word.meaning : "কোন অর্থ পাওয়া যায় নি"
                } / ${
      word.pronunciation ? word.pronunciation : "কোন উচ্চারণ পাওয়া যায়নি"
    }</h2>
                <div class="flex items-center justify-between">
                    <button onclick="loadWordDetail(${
                      word.id
                    })" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-circle-info"></i></button>
                    <button onclick = "pronounceWord('${
                      word.word
                    }')" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-volume-high"></i></button>
                </div>
              
            </div>
        `;
    wordContainer.append(newDiv);
  });
  manageSpinner(false);
};
const displayBtn = (lessons) => {
  const levelContainer = document.getElementById("level-container");
  levelContainer.innerHTML = "";
  for (let lesson of lessons) {
    const newDiv = document.createElement("divs");
    newDiv.innerHTML = `
        <button id = "lesson-btn-${lesson.level_no}" onclick = "levelBtnWord(${lesson.level_no})" class="btn btn-outline btn-primary mb-4 lesson-btn"><i class="fa-solid fa-book-open"></i> Lesson-${lesson.level_no}</button>
        
        `;
    levelContainer.append(newDiv);
  }
};
levelBtn();

document.getElementById("btn-search").addEventListener("click", () => {
  removeActive();
  const input = document.getElementById("input-search");
  const searchValue = input.value.trim().toLowerCase();
  console.log(searchValue);

  fetch("https://openapi.programming-hero.com/api/words/all")
    .then((res) => res.json())
    .then((data) => {
      const allWords = data.data;
      console.log(allWords);
      const filterWords = allWords.filter((word) =>
        word.word.toLowerCase().includes(searchValue)
      );
      displayBtnWord(filterWords);
    });
});
