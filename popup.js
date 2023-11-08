

let parseButton = document.getElementById('parseButton');
let list = document.getElementById('emailList');

// Handler to receive emails from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // Get emails
    let emails = request.emails;

    emails.forEach((email) => {
        let li = document.createElement("li");
        emails = emails.filter(email => !email.includes('png'));
        li.innerText = email;
        list.appendChild(li);
    });

});

// Button's click event listener
parseButton.addEventListener("click", async () => {
    // Get the current active tab
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Execute the script to parse emails on the page
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: parseLeb,
    }).then(res =>{
      console.log(res)
      const completeString = res[0].result
      const placeholder = document.getElementById('placeholder')
      placeholder.innerText = completeString
    });
});

async function fetchData() {
  try {
      const response = await fetch("http://localhost:3000/gpt");
      console.log("GOT AWAIT FETCH")
      if (response.ok) {
          const data = await response.text(); // or response.json() for JSON data
          console.log("Here in ok")
          console.log(data);
      } else {
          console.error("Request failed with status: " + response.status);
      }
  } catch (error) {
      console.error("Error occurred:", error);
  }
}

// Function to scrape emails
  async function parseLeb() {

  try{
    let completeString = ''
    const iframes = document.querySelectorAll('.iframe-fixed.ng-isolate-scope');
    console.log(typeof iframes)
    iframes.forEach(iframe => {
      const iframeDocument = iframe.contentWindow.document
      const spanContainers = iframeDocument.querySelectorAll('[id^="TextContainer"]');
      console.log(spanContainers)
      
      spanContainers.forEach(spanContainer => {
        const spans = spanContainer.querySelectorAll('span')
        let stringFrags = []
        spans.forEach(span => {
          currentSpanContent = span.textContent
          for (let i = 0; i < currentSpanContent.length; i++) {
            stringFrags.push(currentSpanContent.charAt(i))
          }
        })
  
        // for(let i=0; i< stringFrags.length + 90; i+=90){
        //   completeString += stringFrags.slice(i, i+ 90).join('') + '\n'
        // }
        completeString += stringFrags.join('')
  
      })
    })
    


    return completeString
   
  }
  catch (error){
    console.log(error)
  }
   
}



// display count when extension is opened
const cookieName = 'extension_open_count';
const openCount = getCookieValue(cookieName);
if (openCount) {
  updateCountDisplay(openCount);
} else {
  updateCountDisplay('Nothing yet...');
}

// Function to retrieve the value of a specific cookie
function getCookieValue(cookieName) {
    const name = cookieName + '=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    
    for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i];
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1);
      }
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length, cookie.length);
      }
    }
    return null;
  }
  
  // update count display in the extension after every click
  function updateCountDisplay(count) {
    const countDisplay = document.getElementById('count-display');
    if (countDisplay) {
      countDisplay.textContent = `Count: ${count}`;
    }
  }
  
  // retrieve current count and increment it
  function incrementCount(cookieName) {
    const openCount = getCookieValue(cookieName) || 0;
    const updatedCount = parseInt(openCount, 10) + 1;
  
    // Update cookie with new count
    document.cookie = `${cookieName}=${updatedCount}; path=/`;
    
    updateCountDisplay(updatedCount);
  }
  
  // Add a click event listener to the button
  const incrementButton = document.getElementById('increment-button');
  if (incrementButton) {
    incrementButton.addEventListener('click', () => {
      incrementCount(cookieName);
    });
  }


 
