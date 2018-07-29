// We want to wait until the page is loaded so that the form is there to bind the submit listener to.
window.addEventListener('load', function () {
  // Initialise firestore
  var db = firebase.firestore()
  var entriesCollection = db.collection('entries')

  function storeEntry(entry) {
    entriesCollection.add(entry)
  }

  function getEntryForm() {
    return document.getElementById('entry_form')
  }

  function displayEntry(entry) {
    var ol = document.getElementById('entry_list')
    var entryText = document.createTextNode(entry.name + ' (' + entry.email + ')')
    var li = document.createElement('li')

    li.appendChild(entryText)
    ol.appendChild(li)
  }

  var entries = [];

  function addEntry(event) {
    // Stop the form from reloading the page
    event.preventDefault()

    var formData = new FormData(getEntryForm())
    var entry = {
      name: formData.get('name'),
      email: formData.get('email')
    }

    storeEntry(entry)
    displayEntry(entry)
  }

  getEntryForm().addEventListener('submit', addEntry);
})