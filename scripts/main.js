// Bookshelf App Logic

// Storage Key
const STORAGE_KEY = 'BOOKSHELF_APP_DATA';

// State
let books = [];

// DOM Elements
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

// Helper: Load data from localStorage
function loadData() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    books = JSON.parse(data);
  }
}

// Helper: Save data to localStorage
function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

// Helper: Create book element using the required template
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

  // Optional: Edit button (as requested in instruksi.md)
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

// Logic: Render all books
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

// Logic: Add new book
function addBook(event) {
  event.preventDefault();

  const newBook = {
    id: +new Date(), // Number timestamp
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

// Logic: Toggle book status
function toggleBookStatus(bookId) {
  const bookIndex = books.findIndex(b => b.id === bookId);
  if (bookIndex !== -1) {
    books[bookIndex].isComplete = !books[bookIndex].isComplete;
    saveData();
    renderBooks();
  }
}

// Logic: Delete book
function deleteBook(bookId) {
  books = books.filter(b => b.id !== bookId);
  saveData();
  renderBooks();
}

// Logic: Search book
function searchBook(event) {
  event.preventDefault();
  renderBooks(searchBookTitle.value);
}

// Logic: Update submit button text based on checkbox
function updateSubmitButtonText() {
  if (bookFormIsComplete.checked) {
    bookFormSubmitText.innerText = 'Selesai dibaca';
  } else {
    bookFormSubmitText.innerText = 'Belum selesai dibaca';
  }
}

// Logic: Edit book
function editBook(bookId) {
  const book = books.find(b => b.id === bookId);
  if (book) {
    bookFormTitle.value = book.title;
    bookFormAuthor.value = book.author;
    bookFormYear.value = book.year;
    bookFormIsComplete.checked = book.isComplete;
    updateSubmitButtonText();
    
    // Smooth scroll to form
    bookForm.scrollIntoView({ behavior: 'smooth' });
    
    // Change submit behavior temporarily or just update existing one
    // For simplicity, we remove the old one and add a temp update logic or just let user add as new and delete old
    // Better way: remove old book when editing starts if we want a true "edit"
    deleteBook(bookId);
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  renderBooks();

  bookForm.addEventListener('submit', addBook);
  searchBookForm.addEventListener('submit', searchBook);
  bookFormIsComplete.addEventListener('change', updateSubmitButtonText);
});
