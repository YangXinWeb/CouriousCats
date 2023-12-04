let questions = [];

class Question {
  constructor(title) {
    this.title = title;
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
    const newItem = document.createElement("li");
    newItem.classList.add("item");

    const qaIcon = document.createElement("img");
    qaIcon.classList.add("QAicon");
    qaIcon.src = this.image;
    newItem.appendChild(qaIcon);

    const answerCountIcon = document.createElement("span");
    answerCountIcon.classList.add("answer-count-icon");
    newItem.appendChild(answerCountIcon);

    const questionSpan = document.createElement("span");
    questionSpan.classList.add("add-question");
    questionSpan.textContent = this.title;
    newItem.appendChild(questionSpan);

    const triangleButton = document.createElement("div");
    triangleButton.classList.add("triangle-button", "toggle-list");
    newItem.appendChild(triangleButton);

    const answersList = document.createElement("ul");
    answersList.classList.add("answers");
    newItem.appendChild(answersList);

    const answerInput = document.createElement("input");
    answerInput.classList.add("answer-input");
    answerInput.type = "text";
    answerInput.placeholder = "Enter your Answer";
    newItem.appendChild(answerInput);

    const submitAnswerBtn = document.createElement("button");
    submitAnswerBtn.classList.add("submit-answer");
    submitAnswerBtn.textContent = "Submit";
    newItem.appendChild(submitAnswerBtn);

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

  questions.push(new Question(title));

  /* NEW */
  let rightList = document.getElementById("list-right");
  rightList.innerHTML = ""; // reset list
  questions
    .sort((rhs, lhs) => {
      if (rhs.date > lhs.date) {
        return 1;
      } else {
        return -1;
      }
    })
    .forEach((question) => {
      rightList.prepend(question.createNewListItem());
    });

  /* TOP */
  let leftList = document.getElementById("list-left");
  leftList.innerHTML = ""; // reset list
  questions
    .sort((rhs, lhs) => {
      if (rhs.answers.count < lhs.answers.count) {
        return 1;
      } else {
        return -1;
      }
    })
    .forEach((question) => {
      leftList.prepend(question.createNewListItem());
    });

  // Reset question popup
  questionInput.value = "";
  document.getElementById("popup").style.display = "none";

  // Reinitialize listeners for the newly added elements
  initializeListeners();
  updateAnswerCount();
}

function initializeListeners() {
  const triangleButtons = document.querySelectorAll(".triangle-button");

  triangleButtons.forEach((button) => {
    const answers = button.parentElement.querySelector(".answers");
    answers.style.display = "none"; // Hide the answers initially

    button.removeEventListener("click", handleTriangleClick); // Remove the existing click event listener
    button.addEventListener("click", handleTriangleClick);
  });

  // Add an event listener to handle answer submission
  document.querySelectorAll(".submit-answer").forEach((submitAnswerBtn) => {
    submitAnswerBtn.removeEventListener("click", handleAnswerSubmission); // Remove the existing click event listener
    submitAnswerBtn.addEventListener("click", handleAnswerSubmission);
  });
}

function handleTriangleClick(event) {
  event.stopPropagation(); // Prevent the event from bubbling to the parent (item)

  const button = event.currentTarget;
  const answers = button.parentElement.querySelector(".answers");
  button.parentElement.classList.toggle("open");
  answers.style.display = answers.style.display === "none" ? "block" : "none";
}

function handleAnswerSubmission() {
  console.log("Submit button clicked");

  const answers = this.parentElement;
  const answerInput = answers.querySelector(".answer-input");
  const newAnswer = answerInput.value.trim();

  console.log("Answer:", newAnswer);

  if (newAnswer !== "") {
    const dateSpan = document.createElement("span");
    dateSpan.classList.add("date");

    const currentDate = new Date().toLocaleDateString(); // Get the current date

    dateSpan.textContent = `·${currentDate}`;
    dateSpan.style.fontSize = "9px"; // Change the font size
    dateSpan.style.color = "#0000005C"; // Change the color

    const newListItem = document.createElement("li");
    newListItem.textContent = `A: ${newAnswer}`;
    newListItem.appendChild(dateSpan); // Append the dateSpan to the newListItem

    answers.insertBefore(newListItem, answerInput);
    answerInput.value = "";

    // Append the new answer to the corresponding item in the other list
    const otherList =
      answers.parentElement.parentElement.id === "list-left"
        ? document.getElementById("list-right")
        : document.getElementById("list-left");

    const newItemRight = newListItem.cloneNode(true); // Clone only the answer item

    if (answers.parentElement.id === "list-left") {
      // Only append to the other list if the current list is the "New" list
      if (!isAnswerAlreadyAdded(otherList, newAnswer)) {
        otherList.querySelector(".answers").prepend(newItemRight);
      }
    } else {
      // Find the corresponding item in the other list and append the new answer
      const correspondingItem = otherList.querySelector(".add-question");
      const correspondingAnswersList = otherList.querySelector(".answers");
      const correspondingNewAnswer = newAnswer;

      const dateSpanRight = document.createElement("span");
      dateSpanRight.classList.add("date");
      dateSpanRight.textContent = `·${currentDate}`;
      dateSpanRight.style.fontSize = "9px";
      dateSpanRight.style.color = "#0000005C";

      const newListItemRight = document.createElement("li");
      newListItemRight.textContent = `A: ${correspondingNewAnswer}`;
      newListItemRight.appendChild(dateSpanRight);

      correspondingAnswersList.insertBefore(
        newListItemRight,
        correspondingAnswersList.firstChild
      );
    }

    updateAnswerCount();
  }
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

// Function to update the answer count icon
function updateAnswerCount() {
  const triangleButtons = document.querySelectorAll(".triangle-button");
  triangleButtons.forEach((button) => {
    const answers = button.parentElement.querySelector(".answers");
    const answerCountIcon =
      button.parentElement.querySelector(".answer-count-icon");
    const answerCount = answers.querySelectorAll("li").length;
    answerCountIcon.textContent = answerCount;
  });
}

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

// Call initializeListeners initially
initializeListeners();
