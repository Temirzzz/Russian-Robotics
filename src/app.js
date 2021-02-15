import { firebaseConfig } from './config/config'
import { emptyDatasAlert, successAlert, tableSort, deletePopup, closePopup, numberInputLenght } from './utils/utils'

// GLOBAL VARIABLES
let db = firebase.database()

let tableForm = document.querySelector('#reviewForm')
let hiddenId   = document.querySelector('#hiddenId')

let firstName = document.querySelector('#firstName')    
let lastName = document.querySelector('#lastName')   
let patronymic = document.querySelector('#patronymic')   
let dateOfBirth = document.querySelector('#dateOfBirth')    
let placeOfBirth = document.querySelector('#placeOfBirth')  
let email = document.querySelector('#email')    
let phoneNumber = document.querySelector('#phoneNumber')    
let regDate = document.querySelector('#regDate')
let lastVisitTime = new Date().toLocaleString()

// PROHIBITION OF NUMBER
firstName.onkeypress = (e) => {
  if ('0123456789'.indexOf(e.key) != -1)
  e.preventDefault()
}

lastName.onkeypress = (e) => {
  if ('0123456789'.indexOf(e.key) != -1)
  e.preventDefault()
}

patronymic.onkeypress = (e) => {
  if ('0123456789'.indexOf(e.key) != -1)
  e.preventDefault()
}

// CREATE DATAS
tableForm.addEventListener('submit', (e) => {
  e.preventDefault()

  if (!firstName.value || !lastName.value || !patronymic.value|| !dateOfBirth.value || !dateOfBirth.value || !placeOfBirth.value|| !email.value|| !phoneNumber.value) {
    emptyDatasAlert()
    return null 
  }
  if (phoneNumber.value.length < 9) {
    numberInputLenght()
    return null
  }

  let id = hiddenId.value || Date.now() 

  let lastnameTrimed = lastName.value.trim().charAt(0).toUpperCase() + lastName.value.slice(1)
  let firstNameUpp = firstName.value.trim().substr(0,1).toUpperCase() + '.'
  let patronymicTrimed = patronymic.value.trim().substr(0,1).toUpperCase() + '.'
  
  db.ref('data/' + id).set({
    firstNameUpp: firstNameUpp.trim(),
    lastnameTrimed: lastnameTrimed.trim(),
    patronymicTrimed: patronymicTrimed.trim(),
    dateOfBirth: dateOfBirth.value.trim(),
    placeOfBirth: placeOfBirth.value.trim(),
    email: email.value.trim(),
    phoneNumber: phoneNumber.value.trim(),
    regDate: regDate.value.trim(),
    lastVisitTime: lastVisitTime
  })

  hiddenId.value = ''
  firstName.value = ''
  lastName.value = ''
  patronymic.value = ''
  dateOfBirth.value  = ''
  regDate.value = ''
  placeOfBirth.value = ''
  email.value  = ''
  phoneNumber.value  = ''

  successAlert()
})

// READ TABLE
let tableBody = document.getElementById('table__body');
let reviewsRef = db.ref('data/');

reviewsRef.on('child_added', (data) => {
  let item = document.createElement('tr')
  item.id = data.key
  item.innerHTML = reviewTemplate(data.val())
  tableBody.appendChild(item)
})

reviewsRef.on('child_changed', (data) => {
  let reviewNode = document.getElementById(data.key)
  reviewNode.innerHTML = reviewTemplate(data.val())
})

reviewsRef.on('child_removed', (data) => {
  let reviewNode = document.getElementById(data.key)
  reviewNode.parentNode.removeChild(reviewNode)
})

tableBody.addEventListener('click', (e) => {
  let reviewNode = e.target.parentNode

  // UPDATE TABLE
  if (e.target.classList.contains('edit-btn')) {
    hiddenId.value = reviewNode.id

    firstName.value = reviewNode.querySelector('.initials').innerText
    dateOfBirth.value  = reviewNode.querySelector('.date-of-birth').innerText
    placeOfBirth.value  = reviewNode.querySelector('.place-of-birth').innerText
    email.value  = reviewNode.querySelector('.email').innerText
    phoneNumber.value  = reviewNode.querySelector('.phone-number').innerText
    regDate.value  = reviewNode.querySelector('.registr-date').innerText

    // LASTVISITTIME
    let curentTd = e.target.parentNode.children[6]
    curentTd.innerHTML = lastVisitTime

    return false
  }

  // DELETE TABLE
  if (e.target.classList.contains('delete-btn')) {
    deletePopup()
  }

  document.querySelector('.remove-btn').onclick = () => {
    let id = reviewNode.id
    db.ref('data/' + id).remove()
    closePopup()
    return false
  }
  document.querySelector('.close-btn').onclick = closePopup

})

const reviewTemplate = ({firstNameUpp, lastnameTrimed, patronymicTrimed, dateOfBirth, placeOfBirth, email, phoneNumber, regDate}) => {

  return `
    <td class='initials' data-label='ФИО'>${lastnameTrimed + ' '}${firstNameUpp}${patronymicTrimed}</td>    
    <td class='date-of-birth' data-label='День рождения'>${dateOfBirth}</td>
    <td class='place-of-birth' data-label='Место рождения'>${placeOfBirth}</td>
    <td class='email' data-label='Электронная почта'>${email}</td>
    <td class='phone-number' data-label='Номер телефона'>${phoneNumber}</td>
    <td class='registr-date' data-label='Дата регистрации'>${regDate}</td>
    <td class='last-vizit' data-label='Последнее посещение'></td>
    <button class='delete-btn'>Удалить</button>
    <button class='edit-btn'>Редактировать</button>
  `
};

tableSort()
