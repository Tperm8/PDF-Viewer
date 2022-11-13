// Path of the PDF
const url = "../../docs/sample.pdf"; // We use ../ to come outside of a folder while linking/ assigning a file from another folder to an url


// NOTE : Using "let" to declare global variables is a good practice.


// The document that we will get from PDF.js is put into a variable called as pdfDoc
let pdfDoc = null,
  pageNum = 1;
(pageIsRendering = false), // When we run our render page method, the pageIsRendering method is set to TRUE, and after fetching and rendering the sample PDF, this will again be set to FALSE. Therefore, this variable will basically tell us the "STATE OF THE PAGE RENDERING".

  (pageNumIsPending = null); // If we are fetching Multiple Pages.


const scale = 1.5, // Setting the size
  canvas = document.querySelector("#pdf-render"), // Setting the CANVAS
  ctx = canvas.getContext("2d"); // Setting the context
// In the above step, we are fetching the Sample PDF and putting it into the Canvas.




// *** FUNCTIONS ***


// Render The Page
// In the renderPage function/ method, we need to pass the 'Number Of Pages' of the sample document.
const renderPage = (num) => {
  pageIsRendering = true; // Setting the pageIsRendering value to true as the current page is being rendered
  // The above action will tell the current state of the page which is being rendered to the program.



  // Get The Page
  pdfDoc.getPage(num).then((page) => {
    // console.log(page);


    // Setting the scale of the PDF (getViewport)
    const viewport = page.getViewport({ scale });


    // Setting the Width and Height of the canvas to the Viewport Width and Height
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderCtx = {
      canvasContext: ctx,
      viewport,
    };

    page.render(renderCtx).promise.then(() => {
      pageIsRendering = false; // Page is done with rendering

      if (pageNumIsPending != null) {
        renderPage(pageNumIsPending);
        pageNumIsPending = null;
      }
    });


    // Outputting the Current Page Number in the format of "PAGE X OF Y"

    document.querySelector("#page-num").textContent = num;
  });


  // NOTE : To render the current page of the sample PDF on the canvas, the render method will be used.


};



// Check for Pages Rendering : These functions should be invoked when we call Previous Page and Next Page Functions

const queueRenderPage = (num) => {
  if (pageIsRendering) {
    pageNumIsPending = num;
  } else {
    renderPage(num);
  }
};



// Show Previous Page
const showPrevPage = () => {
  if (pageNum <= 1) {
    return;
  }
  pageNum--;
  queueRenderPage(pageNum);
};



// Show Next Page
const showNextPage = () => {
  if (pageNum >= pdfDoc.numPages) {
    return;
  }
  pageNum++;
  queueRenderPage(pageNum);
};



// Get The Document
// Inside this function, once we get the document, we will call the renderPage function.

// Since, we have used the PDF.js CDN, we have access to the object called "pdfjsLib" and will use the getDocument method on that object to get the required document.

pdfjsLib
  .getDocument(url)
  .promise.then((pdfDoc_) => {


    // Setting the Global pdfDoc to this pdfDoc_
    pdfDoc = pdfDoc_;
    // console.log(pdfDoc)


    // Adding the Total Number Of Pages to the Top Bar
    document.querySelector("#page-count").textContent = pdfDoc.numPages;

    renderPage(pageNum); // Passing the pageNum (i.e initial page 1) to the renderPage function
  }) // This will return us with a promise. (Sample Document) Here, we are getting back "pdfDoc_"

  .catch((err) => {
    // Instead of just showing the "Error" Message, we will show what the actual error is, instead of showing the Top Bar.


    // Displaying The Error
    const div = document.createElement("div"); // Creating a 'div' with the help of Javascript instead of going back to the HTML Page.
    div.className = "error";
    div.appendChild(document.createTextNode(err.message));
    document.querySelector("body").insertBefore(div, canvas);


    // Removing The Top Bar
    document.querySelector(".top-bar").style.display = "none";
  });



// Button Events

document.querySelector("#prev-page").addEventListener("click", showPrevPage);

document.querySelector("#next-page").addEventListener("click", showNextPage);