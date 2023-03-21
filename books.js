//Compulsory TASK 1

/* Types of information:
-title
-author
-genre
-year
-'Good reads' rating 
-dropdown: Finished, In progress, Interested 

- Information above should be listed on the webpage.

- User should be able to edit information */

/* Pseudo-code
1.Create form inputs in html file.
2.Create submit button which executes function in JS.
3.In JS, use that function to store information
4.Also create onLoad function which displays information from sessionStorage
5.In JS, create an event listener which allows user to delete an item from list.
6.In JS, create an event listener on an 'edit' button, 
allowing users to edit items from the displayed fields.
*/


// Global items for reference/ placing data objects into books array to later store in session storage.
let count = 0;
let bookList = document.getElementById("bookList") 
let books =[];

// Function which creates class for book object, showcasing multiple class object variables
function Book(title, author, genre, year, rating, ratingNum, readingList, imageURL){
    this.title = title;
    this.author = author;
    this.genre = genre;
    this.year = year;
    this.rating = rating;
    this.ratingNum = ratingNum;
    this.readingList = readingList;
    this.imageURL = imageURL;
}
// Event listener which pushes and displays example books on first load
// After, loading in edited contents by parsing in JSON objects from session storage,
//  and using these values to create the same object to display
window.addEventListener("load", function() {
    let visited = sessionStorage.getItem("visited");
    if (visited){
        alert("Welcome back!");
        let booksData = sessionStorage.getItem("books");
        let bookObjects = JSON.parse(booksData);
        for(let i=0; i <bookObjects.length; i++){
            let saveBook = new Book(
                bookObjects[i].title,
                bookObjects[i].author,
                bookObjects[i].genre,
                bookObjects[i].year,
                bookObjects[i].rating,
                bookObjects[i].ratingNum,
                bookObjects[i].readingList,
                bookObjects[i].imageURL,
            )
            books.push(saveBook);
            displayBook(saveBook);
        }
    }
    else{
        let example1 = new Book(
            "1984",
            "George Orwell",
            "Dystopian fiction, Science Fiction",
            "1949",
            "4.19",
            "4,106,064",
            "progress",
            "https://m.media-amazon.com/images/I/71kxa1-0mfL.jpg",
        )
        let example2 = new Book(
            "Pachinko",
            "Min Jin Lee",
            "Historical Fiction, Japan",
            "2017",
            "4.32",
            "379,267",
            "finished",
            "https://m.media-amazon.com/images/I/81bJlfw-XLL.jpg",
        )
        let example3 = new Book(
            "This is Going to Hurt: Secret Diaries of a Junior Doctor",
            "Adam Kay",
            "Nonfiction, Memoir",
            "2017",
            "4.41",
            "244,717",
            "finished",
            "https://m.media-amazon.com/images/I/81K+L-OVJKL.jpg",
        )
        books.push(example1);
        books.push(example2);
        books.push(example3)
        sessionStorage.setItem("books", JSON.stringify(books));
        books.forEach(element => {
            displayBook(element);
        });
    }
    });

window.addEventListener("load", function(){
    sessionStorage.setItem("visited", "yes")
})
    
//Creating new book object in JS
function addBook() {
    let newBook = new Book(
        document.getElementById("title").value,
        document.getElementById("author").value,
        document.getElementById("genre").value,
        document.getElementById("year").value,
        document.getElementById("rating").value,
        document.getElementById("ratingNum").value,
        document.getElementById("readingList").value,
        document.getElementById("imageURL").value,
    )
    console.log(books);
    books.push(newBook);
    console.log(books);
    sessionStorage.setItem("books", JSON.stringify(books));
    displayBook(newBook);

    // Resetting field inputs
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("genre").value = "";
    document.getElementById("year").value = "";
    document.getElementById("rating").value = "";
    document.getElementById("ratingNum").value = "";
    document.getElementById("readingList").value = "";
    document.getElementById("imageURL").value = "";

    scrollView();
    function scrollView(){
        document.querySelector("#bottom").scrollIntoView();
    }
}


//Inserting book object into webpage
function displayBook(newBook) {
    let listBook = document.createElement("div");
    listBook.classList.add("bookItem");
    listBook.innerHTML = `
        <div class ="bookContainer">
            <div class ="options">
                <button type="button" class="child editBtn formButton">Edit</button>
                <span class="child delBtn">\u00D7</span>
                <input type="hidden" class="myHiddenValue" value="${count}">
            </div>
            <div class="imageContainer">
                <img class="imageSize" src ="${newBook.imageURL}" alt="${newBook.title} book cover">
                <input  type="text" name="imageUrl" class="edit editUrl" value="" placeholder="Insert new image url">
            </div>
            <div class ="bookInfo">
                <div class="headings">
                    <p>Title</p>
                    <p>Author</p>
                    <p>Genre</p>
                    <p>Year</p>
                    <p>Rating</p>
                    <p>Status</p>
                </div>
                <div class="values">
                    <input  type="text" name="title" id="title" class="edit" value="${newBook.title}" disabled>
                    <input  type="text" name="title" id="title" class="edit" value="${newBook.author}" disabled>
                    <input  type="text" name="title" id="title" class="edit" value="${newBook.genre}" disabled>
                    <input  type="text" name="title" id="title" class="edit" value="${newBook.year}" disabled>
                    <input  type="text" name="title" id="title" class="edit" value="${newBook.rating}/5 (${newBook.ratingNum} ratings)" disabled>
                    <select class="edit dropDown" id="readingList" disabled>
                        <option value="">--Choose Status--</option>
                        <option value="interested">Interested</option>
                        <option value="progress">In progress</option>
                        <option value="finished">Finished</option>
                    </select>
                </div>
            </div>
         </div>
    `;
    count++;
    //Setting selection option based on class creation input
    let readingList = listBook.querySelector("#readingList");
    switch (newBook.readingList) {
        case "interested":
            readingList.selectedIndex = 1;
            break;
        case "progress":
            readingList.selectedIndex = 2;
            break;
        case "finished":
            readingList.selectedIndex = 3;
            break;
        default:
            readingList.selectedIndex = 0;
    }
    //Creating new book object based on input fields
    bookList.appendChild(listBook);
    editToggle();
}

// Function which disables 'disabled' attribute of input fields, allowing user to edit the fields.
//Upon clicking edit/finish editing, previous items are removed and new data is appended as updated fields.
// Session storage/ array is updated.
const editToggle = () => {
    const tempEditBtn = document.createElement("div");
    const editButtons = document.getElementsByClassName("editBtn");
    const parentInput = editButtons[editButtons.length - 1].parentNode.parentNode;
    parentInput.querySelector(".editUrl").style.visibility= "hidden";
    let loop = 0;
    deleteBook();
    statusColour();
    
    // Adding event listener to 'edit' button'. Executing function which dissables 'disables' attribute of fields and showing temp input field.
    editButtons[editButtons.length - 1].addEventListener("click", function () {
        resetUrl()
        listener();
        if (loop == 0){
            tempEditButton();
            loop++;
        }

    });
    // Input button with event listener which executes updates to the fields
    function tempEditButton(){
        tempEditBtn.innerHTML = `
        <button type="button" class="tempEditBtn formButton">Finish Editing</button>
        `;
        parentInput.appendChild(tempEditBtn);
        tempEditBtn.addEventListener("click", function(){
            resetUrl();
            listener();
            statusColour();
        })
    }
    // The function which toggles off/on 'disabled'  attribute when called upon.
    function listener(){ 
        const values = parentInput.getElementsByClassName("edit");
        for(let i=1; i< values.length; i++){
            values[i].disabled = !values[i].disabled;
        }
        if (values[1].disabled == true){
            tempEditBtn.style.visibility= "hidden";
            parentInput.querySelector(".editUrl").style.visibility= "hidden";
            statusColour();
        }
        else {
            tempEditBtn.style.visibility= "visible";
            parentInput.querySelector(".editUrl").style.visibility= "visible"
        }
    }

    function updateBookArray(){

    }
    
    /* Function which deletes book upon 'x' click button. Book id renamed in new order in both html tag
    ,js array and session storage.*/
    function deleteBook(){
        const bookList = document.getElementById("bookList");
        const close = parentInput.querySelector(".delBtn");
        close.addEventListener("click", function(){
            books.splice(parentInput.querySelector(".myHiddenValue").value, 1);
            sessionStorage.setItem("books", JSON.stringify(books));
            parentInput.parentNode.style.opacity = "0";
            parentInput.parentNode.style.transform = "scale(0.5)";
            setTimeout(remove, 1500);
            function remove(){
                bookList.removeChild(parentInput.parentNode);
            }
            // Reset count of book item based on current number of items displayed on webpage
            count = 0;
            let items = document.getElementsByClassName("myHiddenValue");
            for (let i=0; i < items.length; i++){
                items[i].value = count;
                count++;
            }

        })
    }
    // Function which resets url image
    function resetUrl(){
        let newUrl = parentInput.querySelector(".editUrl").value;
        if (newUrl){
            parentInput.querySelector(".imageSize").src = newUrl;
            parentInput.querySelector(".editUrl").value = "";
        }
    }
    // Function which changes selection input field color depending on current status
    function statusColour(){
        let status = parentInput.querySelector(".dropDown");
        let statusValue = parentInput.querySelector(".dropDown").value;
        switch(statusValue){
            case "interested":
                status.style.backgroundColor = "rgba(5, 200, 212, 0.5)";
                break;
            case "progress":
                status.style.backgroundColor = "rgba(255, 208, 86, 0.5)";
                break;
            case "finished":
                status.style.backgroundColor = "rgba(5, 212, 117, 0.5)";
                break;
        }
    }
}
