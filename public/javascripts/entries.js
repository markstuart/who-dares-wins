// We want to wait until the page is loaded so that the form is there to bind the submit listener to.
window.addEventListener('load', function () {
  // Initialise firestore
  var db = firebase.firestore()
  var settings = { timestampsInSnapshots: true }
  db.settings(settings)
  var entriesCollection = db.collection('entries')
  listenForEntries()

  function storeEntry(entry) {
    entriesCollection.add(entry)
  }

  // Keep a local cache of the firestore data for easy access
  var entries = []

  function listenForEntries() {
    entriesCollection
      .onSnapshot(function (querySnapshot) {
        entries = querySnapshot.docs
          .map(function (doc) {
            return doc.data()
          })
          .sort(function (a, b) {
            return a.timestamp > b.timestamp ? 1 : -1
          })

        resetEntries()

        entries.forEach(function (entry) {
          updateEntryList(entry)
        })
      });
  }

  function getRandomEntry() {
    var randomIndex = Math.floor(Math.random() * entries.length)
    return entries[randomIndex]
  }

  function pickAWinner() {
    var winner = getRandomEntry()
    var winningText = 'Congratulations ' + winner.name + ', you have won a Frontend Masters subscription!'
    document.getElementById('winner').innerText = winningText
  }

  function getDrawButton() {
    return document.getElementById('draw_button')
  }

  function getEntryForm() {
    return document.getElementById('entry_form')
  }

  function resetEntries() {
    var ol = document.getElementById('entry_list')
    ol.innerHTML = ""
  }

  function updateEntryList(entry) {
    var ol = document.getElementById('entry_list')
    var entryText = document.createTextNode(entry.name + ' (' + entry.email + ')')
    var li = document.createElement('li')

    li.appendChild(entryText)
    ol.appendChild(li)
  }

  function addEntry(event) {
    // Stop the form from reloading the page
    event.preventDefault()

    var formData = new FormData(getEntryForm())
    var now = new Date()
    var entry = {
      timestamp: now.getTime(),
      name: formData.get('name'),
      email: formData.get('email')
    }

    storeEntry(entry)
  }

  getEntryForm().addEventListener('submit', addEntry);
  getDrawButton().addEventListener('click', pickAWinner);
})
