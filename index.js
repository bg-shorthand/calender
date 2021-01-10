// 변수 선언
const today = new Date();
let selectedDate = '';
let currentDay = today;

// 노드 선언
const $title = document.querySelector('.title');
const $selectDate = document.querySelector('.select-date');
const $table = document.querySelector('table');
const $check = document.querySelector('.check');
const $alert = document.querySelector('.alert');
const $addTodo = document.querySelector('.add-todo');
const $popupBg = document.querySelector('.popup-bg');
const $popupDate = document.querySelector('.popup-date');
const $popupHeading = document.querySelector('.popup-heading');
const $popupDetail = document.querySelector('.popup-detail');
const $popupComplited = document.querySelector('.popup-complited');
const $popupAlert = document.querySelector('.popup-alert');
const $navToday = document.querySelector('.today');
const $preBtn = document.querySelector('.pre');
const $nextBtn = document.querySelector('.next');

// xhr
const xhr = new XMLHttpRequest();

// 함수
const addTodo = () => new Promise(s => {
  xhr.open('POST', 'todos');
  xhr.setRequestHeader('content-type', 'application/json');
  xhr.send(JSON.stringify({
    id: `id${$popupDate.value.replace(/-/g, '')}`,
    heading: $popupHeading.value,
    detail: $popupDetail.value
  }));
  xhr.onload = () => {
    s(xhr.response);
  };
});

const getTodos = () => new Promise(s => {
  xhr.open('GET', 'todos');
  xhr.send();
  xhr.onload = () => {
    s(JSON.parse(xhr.response));
  };
});

const deleteTodo = id => new Promise(s => {
  xhr.open('DELETE', `todos/${id}`);
  xhr.send();
  xhr.onload = () => {
    s(xhr.response);
  };
});

const renderTodos = () => {
  for (let i = 1; i < 43; i++) {
    document.querySelector(`.day${i} .todos`).textContent = '';
  }

  const $fragment = document.createDocumentFragment();

  getTodos().then(todos => {
    todos.forEach(({ id, heading }) => {
      const $todo = document.createElement('li');
      const $todoHeading = document.createElement('span');
      const $deleteTodo = document.createElement('button');

      $todo.classList.add('todo');
      $todoHeading.classList.add('todo-heading');
      $todoHeading.textContent = heading;
      $deleteTodo.classList.add('delete-todo');
      $deleteTodo.textContent = 'X';

      $fragment.appendChild($todo);
      $todo.appendChild($todoHeading);
      $todo.appendChild($deleteTodo);

      if (document.querySelector(`#${id} .todos`)) {
        document.querySelector(`#${id} .todos`).appendChild($fragment);
      }

      $fragment.textContent = '';
    });
  });
};

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
    document.querySelector(`.day${i}`).setAttribute('id', `id${new Date(+firstSunday + 86400000 * i - 1).toISOString().slice(0, 10).replace(/-/g, '')}`);

    document.querySelector(`.day${i} .date`).textContent = new Date(+firstSunday + 86400000 * (i - 1)).getDate();
  }

  const todayId = `id${today.toISOString().slice(0, 10).replace(/-/g, '')}`;
  if (document.getElementById(todayId)) {
    document.getElementById(todayId).classList.add('here');
  } else if (document.getElementsByClassName('here')[0]) {
    document.getElementsByClassName('here')[0].classList.remove('here');
  }

  renderTodos();
};

document.addEventListener('DOMContentLoaded', render(today));

// 이벤트
$check.onclick = () => {
  $alert.textContent = '';
  if ($selectDate.value === '') {
    $alert.textContent = '입력이 잘못 되었습니다.';
    return;
  }
  selectedDate = new Date($selectDate.value);
  render(selectedDate);
};

$addTodo.onclick = () => {
  $popupBg.classList.add('active');
};
$popupBg.onclick = e => {
  if (e.target !== $popupBg) return;
  $popupDate.value = '';
  $popupHeading.value = '';
  $popupDetail.value = '';
  $popupAlert.textContent = '';
  $popupBg.classList.remove('active');
};
$popupComplited.onclick = () => {
  if ($popupDate.value === '' || $popupHeading.value === '') {
    $popupAlert.textContent = '날짜, 제목은 필수입니다.';
    return;
  }
  addTodo().then(() => {
    renderTodos();
  });
  $popupDate.value = '';
  $popupHeading.value = '';
  $popupDetail.value = '';
  $popupAlert.textContent = '';
  $popupBg.classList.remove('active');
};

$preBtn.onclick = () => {
  $alert.textContent = '';
  if (currentDay.getMonth() === 0) {
    render(new Date(`${currentDay.getFullYear() - 1}-12-1`));
  } else {
    render(new Date(`${currentDay.getFullYear()}-${currentDay.getMonth()}-1`));
  }
};
$nextBtn.onclick = () => {
  $alert.textContent = '';
  if (currentDay.getMonth() === 11) {
    render(new Date(`${currentDay.getFullYear() + 1}-1-1`));
  } else {
    render(new Date(`${currentDay.getFullYear()}-${currentDay.getMonth() + 2}-1`));
  }
};
$navToday.onclick = () => {
  render(today);
};

$table.onclick = e => {
  if (!e.target.matches('.delete-todo')) return;
  const target = e.target.parentNode.parentNode.parentNode.id;
  deleteTodo(target).then(() => {
    renderTodos();
  });
};