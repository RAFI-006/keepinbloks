import  contractClass from '../blockcodes/contract-credentials.js';
'use strict'

var count = 0; 
window.addEventListener('load',async()=>{
    var isThere = await ethEnabled();
    getAccounts(function(result) {
        console.log(result[0]);
        localStorage.setItem('account', result[0]);
    }
      );
      getDataFromBlocks()
    if (!isThere) {
        alert("Please Install MetaMask to SignIn");
      }

});
var item =  [];
async function getDataFromBlocks()
{
  var jsonStringify = JSON.stringify(contractClass.abi);
  console.log(contractClass.abi);
  let i = 0
  let msg ="";
  console.log(JSON.parse(jsonStringify)); 
  for ( i = 0; i < 8; i++) {
       
       
var contract = new web3.eth.Contract(JSON.parse(jsonStringify),contractClass.contractAddress)
try
{
var s =  contract.methods.getData(web3.utils.asciiToHex("rafi-924"),i).call().then(
 function (value)  {

     console.log(value);  
     var data =  JSON.parse(value);
     console.log(data);
     item.push(data);
     console.log(item);
     localStorage.setItem('notes', JSON.stringify(item));
     count = count+1;
        
  },
 )
 .catch(function(error){
  
  
   msg =  error.message;
   msg == "invalid opcode: opcode 0xfe not defined";
   console.log("hitting");
     
 });
}
catch(e)
{
  console.log("hitting");
   break;
}
console.log(msg);   
if(msg == "invalid opcode: opcode 0xfe not defined")
 {

console.log("hitting" + i);   
break;
 }

}



}



function _bin2String(array) {
  var result = "";
  for (var i = 0; i < array.length; i++) {
    result += String.fromCharCode(parseInt(array[i], 2));
  }
  return result;
}
function _base64ToArrayBuffer(base64) {
  var binary_string = window.atob(base64);
  var len = binary_string.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

let notes = getSavedNotes();
// console.log("notesList");
// console.log(notes);
const timeStamp = moment().valueOf();
const filters = {
    searchText: '',
    sortBy: 'byEdited'
};






function getAccounts(callback) {
    web3.eth.getAccounts((error,result) => {
        if (error) {
            console.log(error);
        } else {
            callback(result);
        }
    });
}


const ethEnabled = async () => {
  if (window.ethereum) {
    await window.ethereum.send('eth_requestAccounts');
    window.web3 = new Web3(window.ethereum);
    return true;
  }
  return false;
}

renderNotes(notes, filters);



document.querySelector('#create-note').addEventListener('click', () => {
  const id = uuidv4();
 
  var  s ={
    id: id,
    title: '',
    body: '',
    createdAt: timeStamp,
    updatedAt: timeStamp,
};
   // saveNotesInBlocks(s);
    
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
