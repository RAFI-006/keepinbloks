import * as contract from '../blockcodes/contract-credentials.js';
'use strict'
//var contract = require('../blockcodes/contract-credentials');


const jsonData = [{
    "constant": false,
    "inputs": [
      {
        "name": "_key",
        "type": "bytes32"
      },
      {
        "name": "_data",
        "type": "string"
      }
    ],
    "name": "setData",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "bytes32"
      },
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "data",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_key",
        "type": "bytes32"
      },
      {
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "getData",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
];
window.addEventListener('load',async()=>{
    var isThere = await ethEnabled();
    getAccounts(function(result) {
        console.log(result[0]);
        localStorage.setItem('account', result[0]);
    
        var jsonStringify = JSON.stringify(jsonData);
        console.log(JSON.parse(jsonStringify)); 
    //    var contractJson = JSON.parse();
       
       var contract = new web3.eth.Contract(JSON.parse(jsonStringify),"0x7ab1fe4049200b57e34e8298d98fc590e9ec1f95")
       var s =  contract.methods.getData(web3.utils.asciiToHex("rafi-inblocks"),0).call().then(
      async  function (value)  {

        
         await getDataFromBlocks(value);
              
        },
       )
       
    
      });
    if (!isThere) {
        alert("Please Install MetaMask to SignIn");
      }

});

async function getDataFromBlocks(value)
{
  console.log("notes" + notes);
  
  localStorage.setItem('notes', JSON.stringify(new Array().push(value)));
 

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
function loadJsonData(callback)
{
    var request = new XMLHttpRequest();
        request.overrideMimeType("application/json");
        request.open("GET", "./blockcodes/contract-abi.json", false);
        request.onreadystatechange = () => {
            if (request.readyState === 4 && request.status === 200) {
                // 2. call your callback function
                //callback(xObj.responseText);
                console.log("hitting");
                console.log("response : " + request.responseText);

            }
            else
            {
                console.log("Error in parsing jsonData");  
            }
        }
        //request.open("GET", "./launch.json", false);
        request.send(null);

        return request.responseText;
}
let notes = getSavedNotes();
console.log("notesList");

console.log(notes);
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

const saveNotesInBlocks = (notes) => {
  var account =   localStorage.getItem('account');
  console.log(account);
  var contract = new web3.eth.Contract(JSON.parse(JSON.stringify(jsonData)),"0x7ab1fe4049200b57e34e8298d98fc590e9ec1f95")

  contract.methods.setData(web3.utils.asciiToHex("rafi-inblocks"),JSON.stringify(notes)).send({from:account});
  
  contract.events.NewValue({},function(error,event){
  
      console.log(event);
  })
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
    title: 'Hey',
    body: 'My first data into blockchain via javascript',
    createdAt: timeStamp,
    updatedAt: timeStamp,
};
    saveNotesInBlocks(s);
    
    // notes.push({
    //     id: id,
    //     title: '',
    //     body: '',
    //     createdAt: timeStamp,
    //     updatedAt: timeStamp,
    // });
    // saveNotes(notes);
    // location.assign(`./edit.html#${id}`);
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
