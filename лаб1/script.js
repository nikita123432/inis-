// 1) Создаем переменную numberOfFilms и запрашиваем у пользователя количество просмотренных фильмов
let numberOfFilms = prompt('Сколько фильмов вы уже посмотрели?');

// 2) Создаем объект personalMovieDB
const personalMovieDB = {
    count: numberOfFilms,
    movies: {}
};

// 3) Задаем пользователю вопросы и записываем ответы в объект movies
for (let i = 0; i < 2; i++) {
    let movieName, movieRating;

    do {
        movieName = prompt('Один из последних просмотренных фильмов?');
    } while (!validateMovieName(movieName));

    do {
        movieRating = prompt('На сколько оцените его?');
    } while (!validateMovieRating(movieRating));

    personalMovieDB.movies[movieName] = movieRating;
}

// 4) Функции для валидации ответов пользователя
function validateMovieName(name) {
    if (name === null || name.trim() === '' || name.length > 50) {
        alert('Название фильма не может быть пустым, отмененным или длиннее 50 символов. Пожалуйста, введите корректное название.');
        return false;
    }
    return true;
}

function validateMovieRating(rating) {
    if (rating === null || rating.trim() === '') {
        alert('Оценка не может быть пустой или отмененной. Пожалуйста, введите корректную оценку.');
        return false;
    }
    return true;
}

// 6) Выводим объект personalMovieDB в консоль
console.log(personalMovieDB);

// 7) Функция для вывода объекта movies в виде таблицы на страницу
function renderMovieTable(movies) {
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    // Создаем заголовок таблицы
    const headerRow = document.createElement('tr');
    const headerMovie = document.createElement('th');
    headerMovie.textContent = 'Фильм';
    const headerRating = document.createElement('th');
    headerRating.textContent = 'Оценка';
    headerRow.appendChild(headerMovie);
    headerRow.appendChild(headerRating);
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Заполняем таблицу данными из объекта movies
    for (const [movie, rating] of Object.entries(movies)) {
        const row = document.createElement('tr');
        const cellMovie = document.createElement('td');
        cellMovie.textContent = movie;
        const cellRating = document.createElement('td');
        cellRating.textContent = rating;
        row.appendChild(cellMovie);
        row.appendChild(cellRating);
        tbody.appendChild(row);
    }

    table.appendChild(tbody);
    document.getElementById('movieTable').appendChild(table);
}

// Вызываем функцию для отображения таблицы
renderMovieTable(personalMovieDB.movies);