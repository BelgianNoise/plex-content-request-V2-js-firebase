const requestList = document.querySelector('#request-list');
const form = document.querySelector('#add-request-form');

// create element & render cafe
function renderCafe(doc){
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
    li.style.backgroundColor
    switch (doc.data().status){
        case '0': // not started
            li.style.backgroundImage = 'url(\'img/pending_trans.jpg\')';
            li.style.backgroundColor = 'rgba(0,84,165,0.4)'
            break;
        case '1': // finished
            li.style.backgroundImage = 'url(\'img/finished_trans.jpg\')';
            li.style.backgroundColor = 'rgba(0,166,84,0.4)'
            break;
        case '-': // no can do
            li.style.backgroundImage = 'url(\'img/no_can_do_trans.jpg\')';
            li.style.backgroundColor = 'rgba(237,27,36,0.4)'
            break;
        case 'b': // bezig
            li.style.backgroundImage = 'url(\'img/busy_trans.jpg\')';
            li.style.backgroundColor = 'rgba(254,242,0,0.4)'
            break;
        default:
    }

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

    // add to list
    requestList.prepend(li);
}

// getting data
// db.collection('cafes').orderBy('city').get().then(snapshot => {
//     snapshot.docs.forEach(doc => {
//         renderCafe(doc);
//     });
// });

// saving data
form.addEventListener('submit', (e) => {
    e.preventDefault();
    var select = document.getElementById("sortDropdown");
    var strSort = select.options[select.selectedIndex].value;

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;

    db.collection('requests').add({
        requester: form.requester.value,
        content: form.content.value,
        imdblink: form.imdblink.value,
        sort: strSort,
        date: today,
        status: '0'
    });
    form.requester.value = '';
    form.content.value = '';
    form.imdblink.value = '';
});

// real-time listener
db.collection('requests').orderBy('date').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if(change.type == 'added'){
            renderCafe(change.doc);
        } else if (change.type == 'removed'){
            let li = requestList.querySelector('[data-id=' + change.doc.id + ']');
            requestList.removeChild(li);
        }
    });
});

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
