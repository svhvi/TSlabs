"use strict";
// Стан додатку
let books = loadBooks();
// Отримання DOM елементів
const form = document.getElementById('book-form');
const bookIdInput = document.getElementById('book-id');
const titleInput = document.getElementById('title');
const authorInput = document.getElementById('author');
const genreSelect = document.getElementById('genre');
const yearInput = document.getElementById('year');
const statusSelect = document.getElementById('status');
const ratingInput = document.getElementById('rating');
const formTitle = document.getElementById('form-title');
const cancelBtn = document.getElementById('cancel-btn');
const searchInput = document.getElementById('search-input');
const filterGenreSelect = document.getElementById('filter-genre');
const booksList = document.getElementById('books-list');
// Функції LocalStorage
function loadBooks() {
    const data = localStorage.getItem('my_books');
    return data ? JSON.parse(data) : [];
}
function saveBooks() {
    localStorage.setItem('my_books', JSON.stringify(books));
}
// Рендеринг списку
function renderBooks() {
    const searchText = searchInput.value.toLowerCase().trim();
    const selectedGenre = filterGenreSelect.value;
    const filtered = books.filter((book) => {
        const matchesSearch = book.title.toLowerCase().includes(searchText) ||
            book.author.toLowerCase().includes(searchText);
        const matchesGenre = selectedGenre === 'all' || book.genre === selectedGenre;
        return matchesSearch && matchesGenre;
    });
    if (filtered.length === 0) {
        booksList.innerHTML = `<p style="text-align: center; color: #9ca3af;">Книжок не знайдено</p>`;
        return;
    }
    booksList.innerHTML = filtered.map((book) => `
    <div class="book-item">
      <div class="book-info">
        <h3>${book.title} <span class="badge">${book.genre}</span></h3>
        <p><strong>Автор:</strong> ${book.author} | <strong>Рік:</strong> ${book.year}</p>
        <p><strong>Статус:</strong> ${book.status} | <strong>Оцінка:</strong> ${'⭐'.repeat(book.rating)}</p>
      </div>
      <div class="book-actions">
        <button class="btn edit" onclick="startEdit('${book.id}')">✏️ Edit</button>
        <button class="btn delete" onclick="deleteBook('${book.id}')">🗑️ Delete</button>
      </div>
    </div>
  `).join('');
}
// Додавання / Редагування
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = bookIdInput.value;
    const bookData = {
        id: id ? id : Date.now().toString(),
        title: titleInput.value,
        author: authorInput.value,
        genre: genreSelect.value,
        year: Number(yearInput.value),
        status: statusSelect.value,
        rating: Number(ratingInput.value)
    };
    if (id) {
        // Оновлення (Update)
        books = books.map((b) => b.id === id ? bookData : b);
    }
    else {
        // Створення (Create)
        books.push(bookData);
    }
    saveBooks();
    renderBooks();
    resetForm();
});
// Функції редагування та видалення
window.startEdit = function (id) {
    const book = books.find((b) => b.id === id);
    if (!book)
        return;
    bookIdInput.value = book.id;
    titleInput.value = book.title;
    authorInput.value = book.author;
    genreSelect.value = book.genre;
    yearInput.value = book.year.toString();
    statusSelect.value = book.status;
    ratingInput.value = book.rating.toString();
    formTitle.textContent = 'Редагувати книжку';
    cancelBtn.style.display = 'inline-block';
};
window.deleteBook = function (id) {
    if (confirm('Ви дійсно бажаєте видалити цю книжку?')) {
        books = books.filter((b) => b.id !== id);
        saveBooks();
        renderBooks();
    }
};
function resetForm() {
    form.reset();
    bookIdInput.value = '';
    formTitle.textContent = 'Додати книжку';
    cancelBtn.style.display = 'none';
}
cancelBtn.addEventListener('click', resetForm);
searchInput.addEventListener('input', renderBooks);
filterGenreSelect.addEventListener('change', renderBooks);
// Перший запуск
renderBooks();
