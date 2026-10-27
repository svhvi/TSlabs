// Інтерфейси
interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  year: number;
  status: 'Прочитано' | 'В процесі' | 'Заплановано';
  rating: number;
}

// Стан додатку
let books: Book[] = loadBooks();

// Отримання DOM елементів
const form = document.getElementById('book-form') as HTMLFormElement;
const bookIdInput = document.getElementById('book-id') as HTMLInputElement;
const titleInput = document.getElementById('title') as HTMLInputElement;
const authorInput = document.getElementById('author') as HTMLInputElement;
const genreSelect = document.getElementById('genre') as HTMLSelectElement;
const yearInput = document.getElementById('year') as HTMLInputElement;
const statusSelect = document.getElementById('status') as HTMLSelectElement;
const ratingInput = document.getElementById('rating') as HTMLInputElement;

const formTitle = document.getElementById('form-title') as HTMLElement;
const cancelBtn = document.getElementById('cancel-btn') as HTMLButtonElement;

const searchInput = document.getElementById('search-input') as HTMLInputElement;
const filterGenreSelect = document.getElementById('filter-genre') as HTMLSelectElement;
const booksList = document.getElementById('books-list') as HTMLElement;

// Функції LocalStorage
function loadBooks(): Book[] {
  const data = localStorage.getItem('my_books');
  return data ? JSON.parse(data) : [];
}

function saveBooks(): void {
  localStorage.setItem('my_books', JSON.stringify(books));
}

// Рендеринг списку
function renderBooks(): void {
  const searchText = searchInput.value.toLowerCase().trim();
  const selectedGenre = filterGenreSelect.value;

  const filtered = books.filter((book: Book) => {
    const matchesSearch = book.title.toLowerCase().includes(searchText) || 
                          book.author.toLowerCase().includes(searchText);
    const matchesGenre = selectedGenre === 'all' || book.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  if (filtered.length === 0) {
    booksList.innerHTML = `<p style="text-align: center; color: #9ca3af;">Книжок не знайдено</p>`;
    return;
  }

  booksList.innerHTML = filtered.map((book: Book) => `
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
form.addEventListener('submit', (e: Event) => {
  e.preventDefault();

  const id = bookIdInput.value;
  const bookData: Book = {
    id: id ? id : Date.now().toString(),
    title: titleInput.value,
    author: authorInput.value,
    genre: genreSelect.value,
    year: Number(yearInput.value),
    status: statusSelect.value as Book['status'],
    rating: Number(ratingInput.value)
  };

  if (id) {
    // Оновлення (Update)
    books = books.map((b: Book) => b.id === id ? bookData : b);
  } else {
    // Створення (Create)
    books.push(bookData);
  }

  saveBooks();
  renderBooks();
  resetForm();
});

// Функції редагування та видалення
(window as any).startEdit = function(id: string): void {
  const book = books.find((b: Book) => b.id === id);
  if (!book) return;

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

(window as any).deleteBook = function(id: string): void {
  if (confirm('Ви дійсно бажаєте видалити цю книжку?')) {
    books = books.filter((b: Book) => b.id !== id);
    saveBooks();
    renderBooks();
  }
};

function resetForm(): void {
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