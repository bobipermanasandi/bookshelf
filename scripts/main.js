const STORAGE_KEY = 'BOOKSHELF_APP_DATA';

let books = [];

const bookForm = document.getElementById('bookForm');
const bookFormTitle = document.getElementById('bookFormTitle');
const bookFormAuthor = document.getElementById('bookFormAuthor');
const bookFormYear = document.getElementById('bookFormYear');
const bookFormIsComplete = document.getElementById('bookFormIsComplete');
const bookFormSubmitText = document.querySelector('#bookFormSubmit span');

const searchBookForm = document.getElementById('searchBook');
const searchBookTitle = document.getElementById('searchBookTitle');

const incompleteBookList = document.getElementById('incompleteBookList');
const completeBookList = document.getElementById('completeBookList');

function loadData() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    books = JSON.parse(data);
  }
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}
function createBookElement(book) {
  const container = document.createElement('div');
  container.setAttribute('data-bookid', book.id);
  container.setAttribute('data-testid', 'bookItem');
  container.classList.add('book_item');

  const title = document.createElement('h3');
  title.setAttribute('data-testid', 'bookItemTitle');
  title.innerText = book.title;

  const author = document.createElement('p');
  author.setAttribute('data-testid', 'bookItemAuthor');
  author.innerText = `Penulis: ${book.author}`;

  const year = document.createElement('p');
  year.setAttribute('data-testid', 'bookItemYear');
  year.innerText = `Tahun: ${book.year}`;

  const action = document.createElement('div');
  action.classList.add('action');

  const completeBtn = document.createElement('button');
  completeBtn.setAttribute('data-testid', 'bookItemIsCompleteButton');
  completeBtn.classList.add('green');
  completeBtn.innerText = book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca';
  completeBtn.addEventListener('click', () => toggleBookStatus(book.id));

  const deleteBtn = document.createElement('button');
  deleteBtn.setAttribute('data-testid', 'bookItemDeleteButton');
  deleteBtn.classList.add('red');
  deleteBtn.innerText = 'Hapus buku';
  deleteBtn.addEventListener('click', () => deleteBook(book.id));

  const editBtn = document.createElement('button');
  editBtn.setAttribute('data-testid', 'bookItemEditButton');
  editBtn.classList.add('orange');
  editBtn.innerText = 'Edit buku';
  editBtn.addEventListener('click', () => editBook(book.id));

  action.appendChild(completeBtn);
  action.appendChild(deleteBtn);
  action.appendChild(editBtn);

  container.appendChild(title);
  container.appendChild(author);
  container.appendChild(year);
  container.appendChild(action);

  return container;
}

function renderBooks(filterText = '') {
  incompleteBookList.innerHTML = '';
  completeBookList.innerHTML = '';

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(filterText.toLowerCase())
  );

  for (const book of filteredBooks) {
    const bookElement = createBookElement(book);
    if (book.isComplete) {
      completeBookList.appendChild(bookElement);
    } else {
      incompleteBookList.appendChild(bookElement);
    }
  }
}

function addBook(event) {
  event.preventDefault();

  const newBook = {
    id: +new Date(),
    title: bookFormTitle.value,
    author: bookFormAuthor.value,
    year: Number(bookFormYear.value),
    isComplete: bookFormIsComplete.checked,
  };

  books.push(newBook);
  saveData();
  renderBooks();
  bookForm.reset();
  updateSubmitButtonText();
}

function toggleBookStatus(bookId) {
  const bookIndex = books.findIndex(b => b.id === bookId);
  if (bookIndex !== -1) {
    books[bookIndex].isComplete = !books[bookIndex].isComplete;
    saveData();
    renderBooks();
  }
}

function deleteBook(bookId) {
  books = books.filter(b => b.id !== bookId);
  saveData();
  renderBooks();
}

function searchBook(event) {
  event.preventDefault();
  renderBooks(searchBookTitle.value);
}
function updateSubmitButtonText() {
  if (bookFormIsComplete.checked) {
    bookFormSubmitText.innerText = 'Selesai dibaca';
  } else {
    bookFormSubmitText.innerText = 'Belum selesai dibaca';
  }
}

function editBook(bookId) {
  const book = books.find(b => b.id === bookId);
  if (book) {
    bookFormTitle.value = book.title;
    bookFormAuthor.value = book.author;
    bookFormYear.value = book.year;
    bookFormIsComplete.checked = book.isComplete;
    updateSubmitButtonText();
    
    bookForm.scrollIntoView({ behavior: 'smooth' });
    
    deleteBook(bookId);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadData();
  renderBooks();

  bookForm.addEventListener('submit', addBook);
  searchBookForm.addEventListener('submit', searchBook);
  bookFormIsComplete.addEventListener('change', updateSubmitButtonText);
});
