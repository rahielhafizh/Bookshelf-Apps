document.addEventListener("DOMContentLoaded", () => {
  refreshBookshelf();
  document.querySelector(".editSection").style.display = "none";
});

function addBook() {
  const title = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const year = document.getElementById("inputBookYear").value;
  const isComplete = document.getElementById("inputBookIsComplete").checked;

  if (title === "" || author === "" || year === "") {
    showPopup("Silakan lengkapi semua informasi buku!", "error");
    return;
  }

  const newBook = {
    id: generateId(),
    title,
    author,
    year: parseInt(year),
    isComplete,
  };

  let books = getBooksFromStorage();
  books.push(newBook);
  saveBooksToStorage(books);

  refreshBookshelf();
  clearForm();

  showPopup("Buku berhasil ditambahkan!", "success");
}

function editBook(bookId) {
  const books = getBooksFromStorage();
  const book = books.find((book) => book.id === bookId);

  if (book) {
    const editSection = document.querySelector(".editSection");
    editSection.style.display = "flex";

    document.getElementById("editBookTitle").value = book.title;
    document.getElementById("editBookAuthor").value = book.author;
    document.getElementById("editBookYear").value = book.year;

    const editButton = document.getElementById("bookEdit");
    editButton.onclick = (event) => {
      event.preventDefault();

      const updatedTitle = document.getElementById("editBookTitle").value;
      const updatedAuthor = document.getElementById("editBookAuthor").value;
      const updatedYear = document.getElementById("editBookYear").value;

      if (updatedTitle === "" || updatedAuthor === "" || updatedYear === "") {
        showPopup("Silakan lengkapi semua informasi buku!", "error");
        return;
      }

      book.title = updatedTitle;
      book.author = updatedAuthor;
      book.year = parseInt(updatedYear);

      saveBooksToStorage(books);
      refreshBookshelf();

      editSection.style.display = "none";
      event.target.reset();
      showPopup("Buku berhasil diperbarui!", "success");
    };
  }
}

function deleteBook(bookId) {
  let books = getBooksFromStorage();
  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex !== -1) {
    books.splice(bookIndex, 1);
    saveBooksToStorage(books);
    refreshBookshelf();

    showPopup("Buku berhasil dihapus!", "success");
  }
}

function saveBooksToStorage(books) {
  localStorage.setItem("books", JSON.stringify(books));
}

function getBooksFromStorage() {
  const storedBooks = localStorage.getItem("books");
  return storedBooks ? JSON.parse(storedBooks) : [];
}

function refreshBookshelf() {
  const incompleteBookshelfList = document.getElementById(
    "incompleteBookshelfList"
  );
  const completeBookshelfList = document.getElementById(
    "completeBookshelfList"
  );

  const books = getBooksFromStorage();

  incompleteBookshelfList.innerHTML = "";
  completeBookshelfList.innerHTML = "";

  books.forEach((book) => {
    const bookItem = document.createElement("article");
    bookItem.classList.add("bookItem");
    bookItem.setAttribute("data-bookid", book.id);
    bookItem.setAttribute("data-testid", "bookItem");
    bookItem.innerHTML = `
      <h3 data-testid="bookItemTitle">${book.title}</h3>
      <p data-testid="bookItemAuthor">Nama Penulis : ${book.author}</p>
      <p data-testid="bookItemYear">Tahun Terbit : ${book.year}</p>
      <div class="listButton">
        <button class="mainButton" id="bookItemIsCompleteButton" onclick="toggleBookStatus(${book.id
      })" data-testid="bookItemIsCompleteButton">
          ${book.isComplete ? "Belum" : "Sudah"}
        </button>
        <button class="secondButton" id="bookItemDeleteButton" onclick="deleteBook(${book.id
      })" data-testid="bookItemDeleteButton">
          <img src="./common/deleteBook.png" alt="Hapus Buku" />
        </button>
        <button class="secondButton" id="bookItemEditButton" onclick="editBook(${book.id
      })" data-testid="bookItemEditButton">
          <img src="./common/editBook.png" alt="Edit Buku" />
        </button>
      </div>
    `;

    if (book.isComplete) {
      completeBookshelfList.appendChild(bookItem);
    } else {
      incompleteBookshelfList.appendChild(bookItem);
    }
  });
}

function toggleBookStatus(bookId) {
  let books = getBooksFromStorage();
  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex !== -1) {
    const book = books[bookIndex];
    book.isComplete = !book.isComplete;

    saveBooksToStorage(books);
    refreshBookshelf();
  }
}

function generateId() {
  return +new Date();
}

function clearForm() {
  document.getElementById("inputBookTitle").value = "";
  document.getElementById("inputBookAuthor").value = "";
  document.getElementById("inputBookYear").value = "";
  document.getElementById("inputBookIsComplete").checked = false;
}

function showPopup(message, type) {
  const popup = document.createElement("div");
  popup.classList.add("popup", type);
  popup.innerHTML = `<p>${message}</p>`;
  document.body.appendChild(popup);

  setTimeout(() => {
    popup.remove();
  }, 2000);
}

document.getElementById("inputBookForm").addEventListener("submit", (event) => {
  event.preventDefault();
  event.target.reset();
});

document.getElementById("searchBook").addEventListener("submit", (event) => {
  event.preventDefault();
  searchBook();
});

function searchBook() {
  const searchTitle = document
    .getElementById("searchBookTitle")
    .value.toLowerCase();
  const books = getBooksFromStorage();
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTitle)
  );

  const incompleteBookshelfList = document.getElementById(
    "incompleteBookshelfList"
  );
  const completeBookshelfList = document.getElementById(
    "completeBookshelfList"
  );

  incompleteBookshelfList.innerHTML = "";
  completeBookshelfList.innerHTML = "";

  filteredBooks.forEach((book) => {
    const bookItem = document.createElement("article");
    bookItem.classList.add("bookItem");
    bookItem.setAttribute("data-bookid", book.id);
    bookItem.setAttribute("data-testid", "bookItem");
    bookItem.innerHTML = `
      <h3 data-testid="bookItemTitle">${book.title}</h3>
      <p data-testid="bookItemAuthor">Nama Penulis : ${book.author}</p>
      <p data-testid="bookItemYear">Tahun Terbit : ${book.year}</p>
      <div class="listButton">
        <button class="mainButton" id="bookItemIsCompleteButton" onclick="toggleBookStatus(${book.id
      })" data-testid="bookItemIsCompleteButton">
          ${book.isComplete ? "Belum" : "Sudah"}
        </button>
        <button class="secondButton" id="bookItemDeleteButton" onclick="deleteBook(${book.id
      })" data-testid="bookItemDeleteButton">
          <img src="./common/deleteBook.png" alt="Hapus Buku" />
        </button>
        <button class="secondButton" id="bookItemEditButton" onclick="editBook(${book.id
      })" data-testid="bookItemEditButton">
          <img src="./common/editBook.png" alt="Edit Buku" />
        </button>
      </div>
    `;

    if (book.isComplete) {
      completeBookshelfList.appendChild(bookItem);
    } else {
      incompleteBookshelfList.appendChild(bookItem);
    }
  });
}
