let questions = [];
let openedList = null;

class Answer {
  constructor(text, id) {
    this.text = text;
    this.id = id;
    this.date = new Date();
  }

  createNewListItem = () => {
    const dateSpan = document.createElement("span");
    dateSpan.classList.add("date");

    const currentDate = new Date().toLocaleDateString(); // Get the current date

    dateSpan.textContent = `·${currentDate}`;
    dateSpan.style.fontSize = "9px"; // Change the font size
    dateSpan.style.color = "#0000005C"; // Change the color

    const newListItem = document.createElement("li");
    newListItem.textContent = this.text;
    newListItem.appendChild(dateSpan); // Append the dateSpan to the newListItem

    return newListItem;
  };
}

class Question {
  constructor(title, id) {
    this.title = title;
    this.id = id;
    this.answers = [];
    this.image = "Pictures/00.png";
    this.date = new Date();
  }

  addAnswer = (answer) => {
    this.answers.push(answer);
  };

  setImage = (image) => {
    this.image = image;
  };

  createNewListItem = () => {
    var self = this; // important to keep a reference to this for closures
    const newItem = document.createElement("li");
    newItem.classList.add("item");

    const qaIcon = document.createElement("img");
    qaIcon.classList.add("QAicon");
    qaIcon.src = this.image;
    newItem.appendChild(qaIcon);

    const answerCountIcon = document.createElement("span");
    answerCountIcon.classList.add("answer-count-icon");
    answerCountIcon.textContent = `${this.answers.length}`
    newItem.appendChild(answerCountIcon);

    const questionSpan = document.createElement("span");
    questionSpan.classList.add("add-question");
    questionSpan.textContent = this.title;
    newItem.appendChild(questionSpan);

    const triangleButton = document.createElement("div");
    triangleButton.classList.add("triangle-button", "toggle-list");
    triangleButton.addEventListener("click", (event) => {
      event.stopPropagation(); // Prevent the event from bubbling to the parent (item)

      const button = event.currentTarget;
      const answers = button.parentElement.querySelector(".answers");
      button.parentElement.classList.toggle("open");
      answers.style.display =
        answers.style.display === "none" ? "block" : "none";
    });
    newItem.appendChild(triangleButton);

    const answersBlock = document.createElement("div");
    answersBlock.classList.add("answers");
    answersBlock.style.display = "none";

    const answersList = document.createElement("ul");
    this.answers.forEach((answer) => {
      answersList.prepend(answer.createNewListItem());
    });
    answersBlock.appendChild(answersList);

    const answerInput = document.createElement("input");
    answerInput.classList.add("answer-input");
    answerInput.type = "text";
    answerInput.placeholder = "Enter your Answer";
    answersBlock.appendChild(answerInput);

    const submitAnswerBtn = document.createElement("button");
    submitAnswerBtn.classList.add("submit-answer");
    submitAnswerBtn.addEventListener("click", () => {
      let answer = new Answer(
        answerInput.value,
        `answer-${this.id}-${this.answers.count}`
      );
      self.addAnswer(answer);
      answerInput.value = "";
      updateList()
    });
    submitAnswerBtn.textContent = "Submit";
    answersBlock.appendChild(submitAnswerBtn);

    newItem.appendChild(answersBlock);

    return newItem;
  };
}

// Function to add a new question to the list
function addQuestionToList() {
  const questionInput = document.querySelector(".question-input");
  const title = questionInput.value.trim();
  if (title.length == 0) {
    return;
  }

  questions.push(new Question(title, `question-id-${questions.coun}`));

  updateList();

  // Reset question popup
  questionInput.value = "";
  document.getElementById("popup").style.display = "none";
}

function updateList() {
  /* TOP */
  let rightList = document.getElementById("list-right");
  rightList.innerHTML = ""; // reset list
  questions
    .sort((rhs, lhs) => {
      if (rhs.answers.length > lhs.answers.length) {
        return 1;
      } else {
        return -1;
      }
    })
    .forEach((question) => {
      rightList.prepend(question.createNewListItem());
    });

  /* NEW */
  let leftList = document.getElementById("list-left");
  leftList.innerHTML = ""; // reset list
  questions
    .sort((rhs, lhs) => {
      if (rhs.date > lhs.date) {
        return 1;
      } else {
        return -1;
      }
    })
    .forEach((question) => {
      leftList.prepend(question.createNewListItem());
    });
}

function saveState() {
  const triangleButtons = document.querySelectorAll(".triangle-button");
  triangleButtons.forEach((button) => {
    const answers = button.parentElement.querySelector(".answers");
    localStorage.setItem(button.parentElement.id, answers.style.display);
  });
}

function loadState() {
  const triangleButtons = document.querySelectorAll(".triangle-button");
  triangleButtons.forEach((button) => {
    const answers = button.parentElement.querySelector(".answers");
    const savedState = localStorage.getItem(button.parentElement.id);
    answers.style.display = savedState === "block" ? "block" : "none";
    button.parentElement.classList.toggle("open", savedState === "block");
  });
}

// Add an event listener to the "Mint" button to reset the state
var mintButton = document.getElementById("btn");
mintButton.addEventListener("click", function (e) {
  e.preventDefault();

  // Load the state from local storage
  loadState();
});

// Show the popup
var btn = document.getElementById("btn");
btn.addEventListener("click", function (e) {
  e.preventDefault();
  document.getElementById("popup").style.display = "block";

  document.getElementById("close-popup").addEventListener("click", function () {
    document.getElementById("popup").style.display = "none";
  });
});

document.querySelectorAll(".submit-question").forEach((submitQuestionBtn) => {
  submitQuestionBtn.removeEventListener("click", addQuestionToList); // Remove the existing click event listener
  submitQuestionBtn.addEventListener("click", addQuestionToList);
});
