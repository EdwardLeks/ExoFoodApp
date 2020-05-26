// Variables
let check = false,
	checkOpen = false,
	currentDate = new Date().toJSON().slice(0, 10).replace(/-/g, '-'),
	foodDate = document.getElementById("food-date-input"),
	foodList = [],
	expiredGroup = document.getElementById("food-group-expired"),
	soonGroup = document.getElementById("food-group-soon"),
	listGroup = document.getElementById("food-group-list")

//Current date in input
foodDate.value = currentDate

// Main Button Function
const addButton = document.querySelector('.add')
const openBtn = () => {
	if (check == false && checkOpen == false) {
		document.querySelector('.menu-bar').classList.add('active-bar')
		check = true
	} else if (checkOpen == true) {
		document.querySelector('.menu-bar').classList.remove('active-bar')
		check = false
		return
	} else {
		document.querySelector('.menu-bar').classList.remove('active-bar')
		check = false
	}
}

// Open/Close Elements Function
document.addEventListener('click', (e) => {
	const cList = e.target.classList
	// Open Menu
	if (cList.contains('fa-bars') || cList.contains('menu') || cList.contains('sidebar') || cList.contains('account-pic')) {
		document.getElementById("sidebar").style.width = "250px"
	} else {
		document.getElementById("sidebar").style.width = "0px"
	}

	// Open Signup
	if (cList.contains('signup') || cList.contains('no-account')) {
		const modal = document.querySelector('#signup-modal')
		modal.style.display = "block"
	} else if (cList.contains('close') || cList.contains('modal') || cList.contains('has-account')) {
		const modal = document.querySelector('#signup-modal')
		modal.style.display = "none"
	}

	// Open Login
	if (cList.contains('login') || cList.contains('has-account')) {
		const modal = document.querySelector('#login-modal')
		modal.style.display = "block"
	} else if (cList.contains('close') || cList.contains('modal') || cList.contains('no-account')) {
		const modal = document.querySelector('#login-modal')
		modal.style.display = "none"
	}

	// Account Info Panel
	const accountInfoPanel = document.querySelector('.account-info-panel')
	const accountBlock = document.querySelector('.account-block')
	if (cList.contains('account-pic')) {
		accountInfoPanel.classList.toggle('active-panel')
		accountBlock.classList.toggle('account-block-active')
	} else {
		accountInfoPanel.classList.remove('active-panel')
		accountBlock.classList.remove('account-block-active')
	}

	// Food Adding Screen
	const foodAddScreen = document.querySelector('.food-add-screen')
	if (cList.contains('add-type')) {
		foodAddScreen.style.display = 'block'
		check = true
		checkOpen = true
		openBtn()
	} else if (cList.contains('close') || foodAddScreen.style.display == 'none') {
		foodAddScreen.style.display = 'none'
		const wraper = document.querySelectorAll(".wraper")
		wraper.forEach(e => {
			e.classList.remove('active-input')
		})
		checkOpen = false
	}
})

// Open Input Wraper
const foodAddScreen = document.querySelector('.food-add-screen')
const wraper = document.querySelectorAll(".wraper")
const input = document.querySelectorAll(".food-input")
for (i = 0; i < wraper.length; i++) {
	wraper[i].addEventListener("click", function (e) {
		if (e.target.classList.contains('food-input')) {

		} else {
			this.classList.toggle("active-input")
		}
	})
}

// UI Setup On Authentication Change
const setupUI = (user) => {
	if (user) {
		//Toggle UI Elements
		document.querySelector('.account-register').style.display = 'none'
		document.querySelector('.account-block').style.display = 'flex'
		db.collection('users').doc(user.uid).get().then(doc => {
			const accountName = document.querySelector('.account-name')
			const accountInfoName = document.querySelector('.account-info-name')
			const accountInfoEmail = document.querySelector('.account-info-email')
			accountName.innerHTML = doc.data().name
			accountInfoName.innerHTML = doc.data().name
			accountInfoEmail.innerHTML = user.email
		})
	} else {
		document.querySelector('.account-register').style.display = 'flex'
		document.querySelector('.account-block').style.display = 'none'
	}
}

//Food Adding Function
const addFood = (open) => {
	if (open) {
		let foodName = document.getElementById("food-name-input"),
			foodDate = document.getElementById("food-date-input"),
			foodNtfc = document.getElementById("food-ntfc-input"),
			id = (new Date()).getTime(),
			inputDate = new Date(foodDate.value).toJSON().slice(0, 10).replace(/-/g, '/')

		class foodObject {
			constructor(id, name, date, notifications, days) {
				this.id = id;
				this.name = name;
				this.date = date;
				this.notifications = notifications;
				this.days = days;
			}
		}

		function dateDiffIndays(date1, date2) {
			dt1 = new Date(date1);
			dt2 = new Date(date2);
			return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) / (1000 * 60 * 60 * 24));
		}

		if (localStorage.length == 0) {
			foodList.push(new foodObject(id, foodName.value, foodDate.value, foodNtfc.value, dateDiffIndays(currentDate, inputDate)))
			localStorage.setItem('food-list', JSON.stringify(foodList))
		} else {
			var existing = localStorage.getItem('food-list')
			existing = existing ? JSON.parse(existing) : {};
			existing.push(new foodObject(id, foodName.value, foodDate.value, foodNtfc.value, dateDiffIndays(currentDate, inputDate)))
			localStorage.setItem('food-list', JSON.stringify(existing))
		}

		foodName.value = ''
		foodDate.value = currentDate
		foodNtfc.value = ''
		expiredGroup.innerHTML = ''
		soonGroup.innerHTML = ''
		listGroup.innerHTML = ''
		renderFood()
		checkOpen = false
		foodAddScreen.style.display = 'none'

	} else {
		return
	}
}

//Food Block Rendering Function
const renderFood = () => {
	//Parse Localstorage
	if (localStorage.length != 0) {

		let foodListStorage = JSON.parse(localStorage.getItem('food-list'))

		foodListStorage.sort(function (a, b) {
			return a.days - b.days
		})

		//Get every object in foodListStorage
		for (keys in foodListStorage) {
			let html = `<div class="food-block" id="${foodListStorage[keys]['id']}">
										<h2 class="food-name" id="food-name">${foodListStorage[keys]['name']}</h2>
										<p class="close" id="close" onclick="deleteFood(${foodListStorage[keys]['id']})"><i class="fas fa-times"></i></p>
										<p class="p" id="days-untill">${foodListStorage[keys]['days'] == 0 ? '' 
										: (foodListStorage[keys]['days'] < 0 ? '' 
										: foodListStorage[keys]['days'])} ${foodListStorage[keys]['days'] == 0 ? ' Today' 
										: (foodListStorage[keys]['days'] < 0 ? Math.abs(foodListStorage[keys]['days']) + ' Days Expired' 
										: ' Days') }</p>
										<p class="food-date p" id="food-date">${foodListStorage[keys]['date']}</p>
									</div>`

			//Check where to append food block
			if (foodListStorage[keys]['days'] <= 0) {
				expiredGroup.innerHTML += html
			} else if ((foodListStorage[keys]['days'] <= 3)) {
				soonGroup.innerHTML += html
			} else {
				listGroup.innerHTML += html
			}

		}
	}
}

// Food deleting function
const deleteFood = (id) => {
	let elem = document.getElementById(id)
	let storage = JSON.parse(localStorage.getItem('food-list'))
	for (keys in storage) {
		if (storage[keys]['id'] == id) {
			storage.splice(keys, 1)
		}
	}
	localStorage.setItem('food-list', JSON.stringify(storage))
	elem.parentNode.removeChild(elem)
}

// //Check if list has block
// const checkList = () =>{	
// 	if(expiredGroup.childNodes.length == 4){
// 		document.querySelector('#food-expired').style.display = 'block'
// 	}
// 	if
// }

renderFood()
console.log(expiredGroup.childNodes.length)