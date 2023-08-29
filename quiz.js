let countSpan = document.querySelector(".quiz-info .count span");
let bullets = document.querySelector(".bullets");
let BulletsSpanContainer = document.querySelector(".bullets .spans");
let QuizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let theResultsContainer = document.querySelector(".results");
let countDownElement = document.querySelector(".countdown");
let currentIndex = 0;
let rightAnswers = 0;
let countDownInterval;
function getQuestions() {
  let myRequest = new XMLHttpRequest();

  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionsobject = JSON.parse(this.responseText);
      let questionsCount = questionsobject.length;

      createBullets(questionsCount);

      addQuestionData(questionsobject[currentIndex], questionsCount);

      countdown(5, questionsCount);
      submitButton.onclick = () => {
        let theRightAnswer = questionsobject[currentIndex].right_answer;

        currentIndex++;

        CheckAnswer(theRightAnswer, questionsCount);

        QuizArea.innerHTML = "";
        answersArea.innerHTML = "";
        addQuestionData(questionsobject[currentIndex], questionsCount);

        handleBullets();
        clearInterval(countDownInterval);
        countdown(5, questionsCount);

        showResults(questionsCount);
      };
    }
  };
  myRequest.open("GET", "questions.json", true);
  myRequest.send();
}
getQuestions();

function createBullets(num) {
  countSpan.innerHTML = num;

  for (let i = 0; i < num; i++) {
    let theBullet = document.createElement("span");

    BulletsSpanContainer.appendChild(theBullet);
    if (i === 0) {
      theBullet.className = "on";
    }
  }
}
function addQuestionData(obj, count) {
  if (currentIndex < count) {
    let QuestionTitle = document.createElement("h2");
    let quetionText = document.createTextNode(obj.title);
    QuestionTitle.appendChild(quetionText);
    QuizArea.appendChild(QuestionTitle);

    for (let i = 1; i <= 4; i++) {
      let mainDiv = document.createElement("div");

      mainDiv.className = "answer";

      let radioInput = document.createElement("input");

      radioInput.name = "questions";
      radioInput.type = "radio";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];
      if (i === 1) {
        radioInput.checked = true;
      }
      let theLabel = document.createElement("label");

      theLabel.htmlFor = `answer_${i}`;
      let theLabelText = document.createTextNode(obj[`answer_${i}`]);
      theLabel.appendChild(theLabelText);
      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(theLabel);
      answersArea.appendChild(mainDiv);
    }
  }
}
function CheckAnswer(ranswer, count) {
  let answers = document.getElementsByName("questions");
  let theChoosenAnswer;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChoosenAnswer = answers[i].dataset.answer;
    }
  }
  if (ranswer === theChoosenAnswer) {
    rightAnswers++;
  }
}

function handleBullets() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpans = Array.from(bulletsSpans);
  arrayOfSpans.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}
function showResults(count) {
  let theResults;
  if (currentIndex === count) {
    QuizArea.remove();
    answersArea.remove();
    submitButton.remove();
    bullets.remove();
    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResults = `<span class="good">Good</span>, ${rightAnswers} From ${count}`;
    } else if (rightAnswers === count) {
      theResults = `<span class="perfect">Perfect</span>, All Answer Is Right`;
    } else {
      theResults = `<span class="bad">Bad</span>,${rightAnswers} From ${count}`;
    }
    theResultsContainer.innerHTML = theResults;
    theResultsContainer.style.padding = "10px";
    theResultsContainer.style.backgroundColor = "white";
    theResultsContainer.style.marginTop = "10px";
    theResultsContainer.style.textAlign = "center";
  }
}

function countdown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countDownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;
      countDownElement.innerHTML = `${minutes}:${seconds}`;
      if (--duration < 0) {
        clearInterval(countDownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}
