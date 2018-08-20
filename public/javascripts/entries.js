// We want to wait until the page is loaded so that the form is there to bind the submit listener to.
window.addEventListener('load', function () {
  // Initialise firestore
  var db = firebase.firestore()
  var entriesCollection = db.collection('entries')
  listenForEntries()

  var allEntries = []

  function storeEntry(entry) {
    entry.timestamp = (new Date()).getTime()
    entriesCollection.add(entry)
  }

  function listenForEntries() {
    entriesCollection
      .onSnapshot(function (querySnapshot) {
        var entries = querySnapshot.docs
          .map(function (doc) {
            return doc.data()
          })
          .sort(function (prev, next) {
            return prev.timestamp > next.timestamp ? 1 : -1
          })
        displayEntries(entries)
        allEntries = entries
      });
  }

  function pickAWinner() {
    var randomInteger = Math.floor(Math.random() * allEntries.length)
    return allEntries[randomInteger];
  }

  function getEntryForm() {
    return document.getElementById('entry_form')
  }

  function displayEntries(entries) {
    var ol = document.getElementById('entry_list')
    ol.innerHTML = ''
    entries.forEach(function (entry) {
      displayEntry(entry, ol)
    })
  }

  function displayEntry(entry, ol) {
    var entryText = document.createTextNode(entry.name + ' (' + entry.email + ')')
    var li = document.createElement('li')

    li.appendChild(entryText)
    ol.appendChild(li)
  }

  function addEntry(event) {
    // Stop the form from reloading the page
    event.preventDefault()

    var formData = new FormData(getEntryForm())
    var entry = {
      name: formData.get('name'),
      email: formData.get('email')
    }

    storeEntry(entry)
  }

  function getDrawButton() {
    return document.getElementById('draw')
  }

  function showWinner() {
    var winner = pickAWinner()
    if (winner) {
      var winningMessage = 'Congratulations ' + winner.name + ', you have won a Frontend Masters subscription!'
      document.getElementById('winner').innerText = winningMessage
    }
  }

  getEntryForm().addEventListener('submit', addEntry)
  getDrawButton().addEventListener('click', showWinner)
})