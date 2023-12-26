// Function to add a book to the bookshelf
function addBook() {
  // Retrieving input values from the form
  const title = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const year = document.getElementById("inputBookYear").value;
  const isComplete = document.getElementById("inputBookIsComplete").checked;

  // Validating input fields
  if (title === "" || author === "" || year === "") {
    alert("Silakan lengkapi semua informasi buku!");
    return;
  }

  // Creating a new book object
  const newBook = {
    id: generateId(),
    title,
    author,
    year: parseInt(year),
    isComplete,
  };

  // Retrieving and updating books in storage
  let books = getBooksFromStorage();
  books.push(newBook);
  saveBooksToStorage(books);

  // Refreshing the bookshelf display and clearing input fields
  refreshBookshelf();
  document.getElementById("inputBookTitle").value = "";
  document.getElementById("inputBookAuthor").value = "";
  document.getElementById("inputBookYear").value = "";
  document.getElementById("inputBookIsComplete").checked = false;
}

// Function to save books to local storage
function saveBooksToStorage(books) {
  localStorage.setItem("books", JSON.stringify(books));
}

// Function to generate a unique book ID
function generateId() {
  return +new Date();
}

// Function to retrieve books from local storage
function getBooksFromStorage() {
  const storedBooks = localStorage.getItem("books");
  return storedBooks ? JSON.parse(storedBooks) : [];
}

// Function to refresh the bookshelf display
function refreshBookshelf() {
  // Retrieving bookshelf containers
  const incompleteBookshelfList = document.getElementById(
    "incompleteBookshelfList"
  );
  const completeBookshelfList = document.getElementById(
    "completeBookshelfList"
  );

  // Retrieving books from storage
  const books = getBooksFromStorage();

  // Clearing existing content
  incompleteBookshelfList.innerHTML = "";
  completeBookshelfList.innerHTML = "";

  // Iterating through each book and creating book items
  books.forEach((book) => {
    const bookItem = document.createElement("article");
    bookItem.classList.add("book_item");
    bookItem.innerHTML = `
        <h3>${book.title}</h3>
        <p>Nama Penulis: ${book.author}</p>
        <p>Tahun Terbit: ${book.year}</p>
        <div class="listButton">
          <button class="green" onclick="toggleBookStatus(${book.id})">
            ${book.isComplete ? "Belum Selesai" : "Selesai"}
          </button>
          <button class="red" onclick="deleteBook(${book.id})">Hapus</button>
        </div>
      `;

    // Appending book items to appropriate bookshelf
    if (book.isComplete) {
      completeBookshelfList.appendChild(bookItem);
    } else {
      incompleteBookshelfList.appendChild(bookItem);
    }
  });
}

// Function to toggle the status of a book (complete/incomplete)
function toggleBookStatus(bookId) {
  let books = getBooksFromStorage();
  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex !== -1) {
    books[bookIndex].isComplete = !books[bookIndex].isComplete;
    saveBooksToStorage(books);
    refreshBookshelf();
  }
}

// Function to delete a book from the bookshelf
function deleteBook(bookId) {
  let books = getBooksFromStorage();
  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex !== -1) {
    books.splice(bookIndex, 1);
    saveBooksToStorage(books);
    refreshBookshelf();
  }
}

// Event listener for submitting the book form
const bookSubmitButton = document.getElementById("bookSubmit");
bookSubmitButton.addEventListener("click", (event) => {
  event.preventDefault();
  addBook();
});

// Event listener for loading the bookshelf on page load
document.addEventListener("DOMContentLoaded", () => {
  refreshBookshelf();
});

// Function to search books by title
function searchBooksByTitle(title) {
  const books = getBooksFromStorage();
  return books.filter((book) =>
    book.title.toLowerCase().includes(title.toLowerCase())
  );
}

// Event listener for submitting the search form
const searchBookForm = document.getElementById("searchBook");
searchBookForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const searchTitle = document.getElementById("searchBookTitle").value;
  const searchResults = searchBooksByTitle(searchTitle);
  displaySearchResults(searchResults);
});

// Function to display search results on the bookshelf
function displaySearchResults(searchResults) {
  // Retrieving bookshelf containers
  const incompleteBookshelfList = document.getElementById(
    "incompleteBookshelfList"
  );
  const completeBookshelfList = document.getElementById(
    "completeBookshelfList"
  );

  // Clearing existing content
  incompleteBookshelfList.innerHTML = "";
  completeBookshelfList.innerHTML = "";

  // Iterating through each search result and creating book items
  searchResults.forEach((book) => {
    const bookItem = document.createElement("article");
    bookItem.classList.add("book_item");
    bookItem.innerHTML = `
        <h3>${book.title}</h3>
        <p>Nama Penulis: ${book.author}</p>
        <p>Tahun Terbit: ${book.year}</p>
        <div class="listButton">
          <button class="green" onclick="toggleBookStatus(${book.id})">
            ${book.isComplete ? "Belum Selesai" : "Selesai"}
          </button>
          <button class="red" onclick="deleteBook(${book.id})">Hapus</button>
        </div>
      `;

    // Appending book items to appropriate bookshelf
    if (book.isComplete) {
      completeBookshelfList.appendChild(bookItem);
    } else {
      incompleteBookshelfList.appendChild(bookItem);
    }
  });
}
