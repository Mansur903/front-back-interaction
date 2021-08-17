window.addEventListener('DOMContentLoaded', () => {
  function loadInfo() {
    /* let request = new XMLHttpRequest();
    request.open('get', 'http://localhost:3000/workers');
    request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    request.send();

    request.addEventListener('readystatechange', function() {
      if (request.readyState === 4 && request.status === 200) {
        let data = JSON.parse(request.response);
        generateCards(data);
      } else {
        console.error("Что-то пошло не так");
      }
    }) */
    
    //---------------------------------------------------------------------------
    let deletedId;
    getData('http://localhost:3000/workers')
      .then(data => generateCards(data))
      .then(() => {
        let deleteButton = document.querySelectorAll('.card__delete');
        console.log(deleteButton);
        deleteButton.forEach((item) => {
          item.addEventListener('click', (e) => {
            e.preventDefault();
            deletedId = item.closest('.card').id
            deleteData(`http://localhost:3000/workers/${deletedId}`)
          })
        })
      })
      .catch(err => console.error(err))

    async function getData(url) {
      const res = await fetch(url);

      if(!res.ok) {
        throw new Error(`Could not fetch ${url}, status: ${res.status}`);
      }
      return await res.json();
    }
    
  }
  loadInfo();

  const addButton = document.querySelector('.form__button');  

  addButton.addEventListener('click', (e) => {
    e.preventDefault();
    const person = {
      "name": document.querySelector('.form__name').value,
      "surname": document.querySelector('.form__surname').value,
      "sex": document.querySelector('.form__sex').value,
      "age": document.querySelector('.form__age').value,
      "photo": document.querySelector('.form__url').value,
    };
    postData('http://localhost:3000/workers', person);
  })

});

async function postData(url, person) {
  let response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(person)
  })
 // let result = await response.json();
}

async function deleteData(url) {
  let response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
  })
  const resData = 'resource deleted...';
  return resData;
}

function generateCards(data) {
  data.forEach(item => {
    let card = document.createElement('li');
    card.classList.add('card');
    card.setAttribute('id', `${item.id}`)

    let icon;
    item.sex === 'male' ? icon = './icons/man.png' : icon = './icons/woman.png'
    
    card.innerHTML = `
      <img class="card__image" src="${item.photo}" alt="worker">
      <div class="card__name">${item.name} ${item.surname}</div>
      <div class="card__sex">
        <img class="card__icon" src=${icon} alt="male">
      </div>
      <div class="card__age">${item.age}</div>
      <button class="card__delete" type="button">Удалить</button>
    `;

    document.querySelector('.cards-list').append(card);
  })
}