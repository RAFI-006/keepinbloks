'use strict'

// Read exisiting notes from local storage
const getSavedNotes = () => {
    const notesJSON = localStorage.getItem('notes');
     

    try{

        console.log(JSON.parse(notesJSON));
        
        return notesJSON ? JSON.parse(notesJSON) : [];

    } catch (e){
        console.log(e);
        return [];
      
    }   
}



// Save notes to localStorage
const saveNotes = (notes) => {
    // console.log(notes);
    localStorage.setItem('notes', JSON.stringify(notes));

}
//remove notes by id
const removeNote = (id) => {
    const index = notes.findIndex((note) => note.id === id)

    if (index > -1) {
        notes.splice(index,1);
    }
}


// Generate the DOM structure for a note
const generateNoteDOM = (note) => {
    const noteEl = document.createElement('div');
    noteEl.setAttribute('id','parent');
    const textEl = document.createElement('p');
    const statusEl = document.createElement('p');
    const bodyText =  document.createElement('p');
   
   
    // Setup the note title text
    if (note.title.length > 0){
         textEl.textContent = note.title;
         bodyText.textContent = note.body;
         textEl.classList.add('list-item__title');
         bodyText.classList.add('list-item__body')
        
         noteEl.appendChild(textEl);
         noteEl.appendChild(bodyText);
    
   
 
     
    noteEl.classList.add('list-item');

    //Setup the status message
    statusEl.textContent = generateLastEdited(note.updatedAt);
    statusEl.classList.add('list-item__subtitle');
    noteEl.appendChild(statusEl);
   
      noteEl.addEventListener('click', (e) => {
        
    
       location.assign(`./edit.html#${note.id}`);
       })

    }

   
    return noteEl;
}

const sortNotes = (notes, sortBy) => {
    if (sortBy === 'byEdited'){
        return notes.sort((a,b) => {
            if (a.updatedAt > b.updatedAt){
                return -1;
            } else if (a.updatedAt < b.updatedAt){
                return 1;
            } else {
                return 0;
            }
        })
    } else if (sortBy === 'byCreated') {
        return notes.sort( (a,b) => {
            if (a.createdAt > b.createdAt){
                return -1;
            } else if (a.createdAt < b.createdAt){
                return 1;
            } else {
                return 0;
            }
        })
    } else if (sortBy === 'alphabetical'){
        return notes.sort( (a,b) => {
            if (a.title.toLowerCase() < b.title.toLowerCase()){
                return -1;
            } else if (a.title.toLowerCase() > b.title.toLowerCase()){
                return 1;
            } else {
                return 0;
            }
        })
    } else {
        return notes;
    }
}

// Render application notes
const renderNotes = (notes, filters) => { 
    const notesEl = document.querySelector('#notes') 
    notes = sortNotes(notes, filters.sortBy);
    const filteredNotes = notes.filter( (note) => {
        const title = note.title.toLowerCase();
        const filter = filters.searchText.toLowerCase();
        return title.includes(filter) // || body.includes(filter);
    })

    notesEl.innerHTML = '';

    if (filteredNotes.length > 0){
        filteredNotes.forEach( (note) => {
            const p = generateNoteDOM(note);
            notesEl.appendChild(p);
        })
    } else if(notes.length==0) {
        const emptyMessage = document.createElement('p')
        emptyMessage.textContent = 'No notes to show'
        emptyMessage.classList.add('empty-message')
        notesEl.appendChild(emptyMessage)
    }
    else
    {
        const emptyMessage = document.createElement('p')
        emptyMessage.textContent = 'No notes to show'
        emptyMessage.classList.add('empty-message')
        notesEl.appendChild(emptyMessage)
    }
};

// Generate the last edited message
const generateLastEdited = (timestamp) => `Added  ${moment(timestamp).fromNow()}`;