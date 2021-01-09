const today = new Date();
let selectedDate = '';
let currentDay = today;

const $selectDate = document.querySelector('.select-date');
const $check = document.querySelector('.check');
const $title = document.querySelector('.title');
const $navToday = document.querySelector('.today');
const $preBtn = document.querySelector('.pre');
const $nextBtn = document.querySelector('.next');

const render = date => {
  const renderDate = new Date(date);
  currentDay = renderDate;

  $title.textContent = `${renderDate.getFullYear()}년 ${renderDate.getMonth() + 1} 월`;
  $navToday.textContent = today.toISOString().slice(0, 10);

  const firstDay = new Date(`${renderDate.getFullYear()}-${renderDate.getMonth() + 1}-1`);

  let firstSunday = {};
  switch (firstDay.getDay()) {
    case 0: firstSunday = new Date(firstDay - 86400000 * 0);
      break;
    case 1: firstSunday = new Date(firstDay - 86400000 * 1);
      break;
    case 2: firstSunday = new Date(firstDay - 86400000 * 2);
      break;
    case 3: firstSunday = new Date(firstDay - 86400000 * 3);
      break;
    case 4: firstSunday = new Date(firstDay - 86400000 * 4);
      break;
    case 5: firstSunday = new Date(firstDay - 86400000 * 5);
      break;
    case 6: firstSunday = new Date(firstDay - 86400000 * 6);
      break;
    default: firstSunday = 0;
  }

  for (let i = 1; i < 43; i++) {
    document.querySelector(`.day${i}`).setAttribute('id', `${new Date(+firstSunday + 86400000 * i).getFullYear()}${new Date(+firstSunday + 86400000 * i).getMonth() + 1}${new Date(+firstSunday + 86400000 * i).getDate() - 1}`);

    document.querySelector(`.day${i}`).textContent = new Date(+firstSunday + 86400000 * (i - 1)).getDate();
  }

  document.getElementById(`${renderDate.getFullYear()}${renderDate.getMonth() + 1}${renderDate.getDate()}`).style.backgroundColor = 'yellow';
};

document.addEventListener('DOMContentLoaded', render(today));

$check.onclick = () => {
  if ($selectDate.value === '') return;
  selectedDate = new Date($selectDate.value);
  render(selectedDate);
};

$preBtn.onclick = () => {
  if (currentDay.getMonth() === 0) {
    render(new Date(`${currentDay.getFullYear() - 1}-12-1`));
  } else {
    render(new Date(`${currentDay.getFullYear()}-${currentDay.getMonth()}-1`));
  }
};

$nextBtn.onclick = () => {
  if (currentDay.getMonth() === 11) {
    render(new Date(`${currentDay.getFullYear() + 1}-1-1`));
  } else {
    render(new Date(`${currentDay.getFullYear()}-${currentDay.getMonth() + 2}-1`));
  }
};