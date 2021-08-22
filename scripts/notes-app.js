let notes = getSavedNotes();
const timeStamp = moment().valueOf();
const filters = {
    searchText: '',
    sortBy: 'byEdited'
};

window.addEventListener('load',async()=>{

    // if (window.ethereum) {
    //     window.web3 = new Web3(window.ethereum);

    //      window.ethereum.enable();
    //     ret = window.ethereum.enable();
    //     getAccounts(function(result) {
    //         console.log(result[0]);
    //     });
    //     console.log(window.web3);
    //     return true;
    // }

    var isThere = await ethEnabled();
    if (!isThere) {
        alert("Please Install MetaMask to SignIn");
      }

});




 
const ethEnabled = async () => {
  if (window.ethereum) {
    await window.ethereum.send('eth_requestAccounts');
    window.web3 = new Web3(window.ethereum);
    return true;
  }
  return false;
}
function getAccounts(callback) {
    web3.eth.getAccounts((error,result) => {
        if (error) {
            console.log(error);
        } else {
            callback(result);
        }
    });
}
renderNotes(notes, filters);
'use strict'


document.querySelector('#create-note').addEventListener('click', () => {
    const id = uuidv4();
    notes.push({
        id: id,
        title: '',
        body: '',
        createdAt: timeStamp,
        updatedAt: timeStamp,
    });
    saveNotes(notes);
    location.assign(`./edit.html#${id}`);
});


document.querySelector('#search-text').addEventListener('input', (e) => {
    filters.searchText = e.target.value;
    renderNotes(notes, filters);
});

document.querySelector('#filter-by').addEventListener('change', (e) => {
    filters.sortBy = e.target.value;
    renderNotes(notes, filters);
})

window.addEventListener('storage', (e) => {
    if (e.key === 'notes'){
        notes = JSON.parse(e.newValue);
        renderNotes(notes, filters);
    }
})
