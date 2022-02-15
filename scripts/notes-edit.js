import  contractClass from '../blockcodes/contract-credentials.js';
const titleElement = document.querySelector('#note-title');
const timeElement = document.querySelector('#time-stamp');
const bodyElement = document.querySelector('#note-body');

window.addEventListener('load',async()=>{
    var isThere = await ethEnabled();
    document.getElementById("loader_icon").style.visibility = "hidden";
    if (!isThere) {
        alert("Please Install MetaMask to SignIn");
      }

});
const noteId = location.hash.substr(1);
console.log(noteId);

let notes = getSavedNotes();
let note = notes.find( (note) => note.id === noteId);

// if (!note){
//     location.assign('./index.html');
// }

//Get the existing note's info from the page
// timeElement.textContent = generateLastEdited(note.updatedAt);
titleElement.value = note.title;
bodyElement.value = note.body;

titleElement.addEventListener('input', () => {
    note.title = titleElement.value;
    note.updatedAt = moment().valueOf();
    timeElement.textContent = generateLastEdited(note.updatedAt);
   // saveNotes(notes);
})

bodyElement.addEventListener('input', () => {
    note.body = bodyElement.value;
    note.updatedAt = moment().valueOf();
    timeElement.textContent = generateLastEdited(note.updatedAt);
   // saveNotes(notes);
})

document.querySelector('#remove-note').addEventListener('click', () =>{
  
    document.getElementById("loader_icon").style.visibility = "visible";
    var  s ={
        id:noteId,
        title:  note.title,
        body: note.body,
        createdAt:moment().valueOf(),
        updatedAt:  note.updatedAt,
    };
    
    console.log(JSON.stringify(s));
     saveNotesInBlocks(s); 
    
     saveNotes(notes);
   // location.assign('./index.html');
  
   
})

const ethEnabled = async () => {
    if (window.ethereum) {
      await window.ethereum.send('eth_requestAccounts');
      window.web3 = new Web3(window.ethereum);
      return true;
    }
    return false;
  }

const saveNotesInBlocks = (s) => {
   
    var account =   localStorage.getItem('account');
    console.log(account);
    var contract = new web3.eth.Contract(JSON.parse(JSON.stringify(contractClass.abi)),"0x7ab1fe4049200b57e34e8298d98fc590e9ec1f95")
  
    contract.methods.setData(web3.utils.asciiToHex("rafi-123"),JSON.stringify(s)).send({from:account}).on('receipt',function(){
      
       
        
        location.assign('./index.html');
        localStorage.setItem("reload","true");
    });
    
    // contract.events.NewValue({},function(error,event){
    
    //     console.log("hitting event");
    // })
  }

window.addEventListener('storage', (e) =>{
    if (e.key === 'notes'){
        notes = JSON.parse(e.newValue);
        note = notes.find( (note) => note.id === noteId);
        
        if (!note){
            location.assign('./index.html');
        }
        timeElement.textContent = `Last edited ${moment(note.updatedAt).fromNow()}`;
        titleElement.value = note.title;
        bodyElement.value = note.body;
    }
})

