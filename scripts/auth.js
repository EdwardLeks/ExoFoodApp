//Listen To User Authentication Change
auth.onAuthStateChanged(user => {
	if (user) {
		//Get data
		setupUI(user)
	} else {
		setupUI()
	}
})

// Sign Up
const signupForm = document.querySelector('#signup-form')
signupForm.addEventListener('submit', (e) => {
	e.preventDefault()
	//Get user info
	const email = signupForm['signup-email'].value
	const password = signupForm['signup-password'].value

	//Sign up the user
	auth.createUserWithEmailAndPassword(email, password).then(cred => {
		return db.collection('users').doc(cred.user.uid).set({
			name: signupForm['signup-name'].value,
		})
	}).then(() => {
		// Close Modal
		const modal = document.querySelector('#signup-modal')
		modal.style.display = "none"
	})
})

// Log In
const loginForm = document.querySelector("#login-form")
loginForm.addEventListener('submit', () => {
	const email = loginForm['login-email'].value
	const password = loginForm['login-password'].value

	auth.signInWithEmailAndPassword(email, password).then(() => {
		// Close Modal
		const modal = document.querySelector('#login-modal')
		modal.style.display = "none"
	})
})

// Log Out
const logOut = document.querySelector('#logout')
logOut.addEventListener('click', (e) => {
	e.preventDefault()
	auth.signOut()
})