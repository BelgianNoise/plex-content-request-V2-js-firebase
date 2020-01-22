const requestList = document.querySelector('#request-list');
const form = document.querySelector('#add-request-form');
let pending = '#98BADD';
let finished = '#99DAB8';
let nocando = '#F8A3A6';
let progress = '#FEFA99';

// create element & render cafe
function renderRequest(doc){
    // li
    let li = document.createElement('li');
    li.setAttribute('data-id', doc.id);

    // requester
    let requester = document.createElement('span');
    requester.textContent = doc.data().requester;
    li.appendChild(requester);

    // content
    let content = document.createElement('span');
    content.textContent = doc.data().sort + ': ' + doc.data().content;
    li.appendChild(content);

    // date
    let date = document.createElement('span');
    date.textContent = 'Aangevraagd op: ' + doc.data().date;
    date.style.fontSize = '0.8em';
    li.appendChild(date);

    // imdb link
    if(doc.data().imdblink != ""){
        var imdblink = document.createElement('a');
        var linkText = document.createTextNode("Bekijk op IMDB");
        imdblink.appendChild(linkText);
        imdblink.title = doc.data().imdblink;
        imdblink.href = doc.data().imdblink;
        li.appendChild(imdblink);
    }

    // status
    li.style.backgroundRepeat = 'no-repeat';
    li.style.backgroundPosition = 'right';
    li.style.backgroundSize = '60%';
    switch (doc.data().status){
        case '0': // pending
            li.style.backgroundImage = 'url(\'img/pending_trans.jpg\')';
            li.style.backgroundColor = pending;
            break;
        case '1': // finished
            li.style.backgroundImage = 'url(\'img/finished_trans.jpg\')';
            li.style.backgroundColor = finished;
            break;
        case '-': // no can do
            li.style.backgroundImage = 'url(\'img/no_can_do_trans.jpg\')';
            li.style.backgroundColor = nocando;
            break;
        case 'b': // bezig
            li.style.backgroundImage = 'url(\'img/busy_trans.jpg\')';
            li.style.backgroundColor = progress;
            break;
        default:
    }

    if(firebase.auth().currentUser){
        // cross
        let cross = document.createElement('div');
        cross.textContent = 'x';
        li.appendChild(cross);
        // deleting data
        cross.addEventListener('click', (e) => {
            e.stopPropagation();
            let id = e.target.parentElement.getAttribute('data-id');
            db.collection('requests').doc(id).delete();
        });

        // update
        let update = document.createElement('div');
        update.className = 'update';
        update.textContent = 'Verander status';
        // drop down
        let drop = document.createElement('div');
        drop.className = 'drop';
        let btn1 = document.createElement('button');
        btn1.textContent = 'Finished';
        btn1.addEventListener('click',(e)=>{
            let id = e.target.parentElement.parentElement.parentElement.getAttribute('data-id');
            db.collection('requests').doc(id).update({status: '1'});
        });
        drop.appendChild(btn1);
        let btn2 = document.createElement('button');
        btn2.textContent = 'Pending...';
        btn2.addEventListener('click',(e)=>{
            let id = e.target.parentElement.parentElement.parentElement.getAttribute('data-id');
            db.collection('requests').doc(id).update({status: '0'});
        });
        drop.appendChild(btn2);
        let btn3 = document.createElement('button');
        btn3.textContent = 'No Can Do';
        btn3.addEventListener('click',(e)=>{
            let id = e.target.parentElement.parentElement.parentElement.getAttribute('data-id');
            db.collection('requests').doc(id).update({status: '-'});
        });
        drop.appendChild(btn3);
        let btn4 = document.createElement('button');
        btn4.textContent = 'In Progress...';
        btn4.addEventListener('click',(e)=>{
            let id = e.target.parentElement.parentElement.parentElement.getAttribute('data-id');
            db.collection('requests').doc(id).update({status: 'b'});
        });
        drop.appendChild(btn4);
        update.appendChild(drop);

        li.appendChild(update);
    }
    // add to list
    requestList.prepend(li);
}

// saving data
form.addEventListener('submit', (e) => {
    e.preventDefault();

    let req = form.requester.value;
    let cont = form.content.value;
    let imdb = form.imdblink.value;
    var select = document.getElementById("sortDropdown");
    var strSort = select.options[select.selectedIndex].value;

    // validatie
    let errArr = validateInput(req, cont, imdb, strSort);
    var errField = document.querySelector('.err-field');
    var errList = document.querySelector('.errors');
    if(errArr.length > 0){
        errList.innerHTML = "";
        errArr.forEach(element => {
            var p = document.createElement('p');
            p.textContent = element;
            errList.appendChild(p);
        });
        errField.style.display = 'grid';
        return;
    }

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;

    db.collection('requests').add({
        requester: req,
        content: cont,
        imdblink: imdb,
        sort: strSort,
        date: today,
        status: '0'
    });
    form.requester.value = '';
    form.content.value = '';
    form.imdblink.value = '';
    errField.style.display = 'none';
    var messField = document.querySelector('.mess-field');
    var messList = document.querySelector('.messages');
    messList.innerHTML = "";
    var p = document.createElement('p');
    p.textContent = "\"" + cont + "\" is toegevoegd aan de lijst!";
    messList.appendChild(p);
    messField.style.display = 'grid';
    setTimeout(()=>messField.style.display = 'none',5000);
});

// real-time listener
db.collection('requests').orderBy('date').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if(change.type == 'added'){
            renderRequest(change.doc);
        } else if (change.type == 'removed'){
            let li = requestList.querySelector('[data-id=' + change.doc.id + ']');
            requestList.removeChild(li);
        } else if (change.type == 'modified'){
            updateBackground(change.doc)
        }
    });
});

function validateInput(requester, content, imdb, sort){
    let err = [];
    if(requester.toLowerCase().includes('niels') || requester.toLowerCase().includes('biels')){
        err.push('BIELS BIELS BIELS BIELS BIELS BIELS BIELS BIELS BIELS BIELS BIELS');
    }
    if(requester.trim() == ""){
        err.push('Je bent vergeten je naam in te geven!');
    }
    if(content.trim() == ""){
        err.push('Je bent vergeten de naam van de film of serie in te geven!');
    }
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol whatever dees is
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    if(!pattern.test(imdb) && imdb.trim() != ""){
        err.push('De link die je hebt ingegeven is niet valide! (voorbeeld: https://www.imdb.com)');
    }
    if(sort.toLowerCase() != 'film' && sort.toLowerCase() != 'serie'){
        err.push('Makker het is film of serie en niks anders eh flikker!!!');
    }
    return err;
}
function updateBackground(doc){
    let li = requestList.querySelector('[data-id=' + doc.id + ']');
    switch (doc.data().status){
        case '0': // pending
            li.style.backgroundImage = 'url(\'img/pending_trans.jpg\')';
            li.style.backgroundColor = pending;
            break;
        case '1': // finished
            li.style.backgroundImage = 'url(\'img/finished_trans.jpg\')';
            li.style.backgroundColor = finished;
            break;
        case '-': // no can do
            li.style.backgroundImage = 'url(\'img/no_can_do_trans.jpg\')';
            li.style.backgroundColor = nocando;
            break;
        case 'b': // bezig
            li.style.backgroundImage = 'url(\'img/busy_trans.jpg\')';
            li.style.backgroundColor = progress;
            break;
        default:
    }
}

// pop up voor legende
document.querySelector('#legende').addEventListener('click',
    function() {
        document.querySelector('.legendePopup').style.display = 'flex';
    }
);
document.querySelector('.closePopup').addEventListener('click',
    function() {
        document.querySelector('.legendePopup').style.display = 'none';
    }
);
