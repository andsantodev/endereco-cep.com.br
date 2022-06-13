const addressForm = document.querySelector('#address-form')
const cepInput = document.querySelector('#cep')
const addressInput = document.querySelector('#address')
const cityInput = document.querySelector('#city')
const neighborhoodInput = document.querySelector('#neighborhood')
const regionInput = document.querySelector('#region')
const formInputs = document.querySelectorAll("[data-input]")

const closeButton = document.querySelector('#close-message')
const fadeElement = document.querySelector('#fade')

// validate CEP input
cepInput.addEventListener('keypress', (e) => {
  const onlyNumbers = /[0-9]|\./
  const key = String.fromCharCode(e.keyCode)
  if (!onlyNumbers.test(key)) {
    e.preventDefault()
    return
  }
})

// get address event
cepInput.addEventListener('keyup', (e) => {
  const inputValue = e.target.value
  if (inputValue.length === 8) {
    getAddress(inputValue)
  }
})

// get customer address from API
const getAddress = async (cep) => {
  toggleLoader()
  cepInput.blur()
  const apiURL = `https://viacep.com.br/ws/${cep}/json/`
  const response = await fetch(apiURL)
  const data = await response.json()

  // console.log(data)
  
  if (data.erro === 'true') {
    if (!addressInput.hasAttribute("disabled")) {
      toggleDisabled();
    }
    addressForm.reset()
    toggleLoader()
    toggleMessage('CEP inválido, tente novamente')
    return
  }

  // activate disabled attribute if form is empty
  if (addressInput.value === "") {
    toggleDisabled();
  }

  addressInput.value = data.logradouro
  cityInput.value = data.localidade
  neighborhoodInput.value = data.bairro
  regionInput.value = data.uf
  toggleLoader()
}

// add or remove disabled attribute
const toggleDisabled = () => {
  if (regionInput.hasAttribute('disabled')) {
    formInputs.forEach((input) => {
      input.removeAttribute('disabled')
    })
  } else {
    formInputs.forEach((input) => {
      input.setAttribute('disabled', 'disabled')
    })
  }
}

// show or hide loader
const toggleLoader = () => {
  const loaderElement = document.querySelector('#loader')

  fadeElement.classList.toggle('hide')
  loaderElement.classList.toggle('hide')
}

// show or hide message
const toggleMessage = (msg) => {
  const messageElement = document.querySelector('#message')
  const messageElementText = document.querySelector('#message p')
  messageElementText.innerHTML = msg
  
  fadeElement.classList.toggle('hide')
  messageElement.classList.toggle('hide')
}

// close message modal
closeButton.addEventListener('click', () => toggleMessage())

// save address
addressForm.addEventListener("submit", (e) => {
  e.preventDefault();
  toggleLoader();
  setTimeout(() => {
    toggleLoader();
    toggleMessage("Endereço salvo com sucesso!");
    addressForm.reset();
    toggleDisabled();
  }, 1000);
});