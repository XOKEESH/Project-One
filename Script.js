document.addEventListener('DOMContentLoaded', () => {
    const knownSpirits = ['Tequila', 'Vodka', 'Gin', 'Bourbon', 'Whiskey', 'Rum', 'Mezcal', 'Brandy']

    // Search for cocktails
    document.getElementById('search-btn').addEventListener('click', function() {
        const searchTerm = document.getElementById('search').value

        if (searchTerm) {
            fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchTerm}`)
                .then(response => response.json())
                .then(data => {
                    const resultsContainer = document.getElementById('results')
                    const drinkList = document.getElementById('drink-list')
                    const drinkDetails = document.getElementById('drink-details')

                    drinkList.innerHTML = ''
                    drinkDetails.classList.add('hidden')

                    if (data.drinks) {
                        if (data.drinks.length === 1) {
                            displaySingleDrink(data.drinks[0])
                        } else {
                            data.drinks.forEach(drink => {
                                const mainSpirit = getMainSpirit(drink)
                                const drinkCard = document.createElement('div')
                                drinkCard.classList.add('drink-card')
                                drinkCard.innerHTML = `
                                    <h3>${drink.strDrink}</h3>
                                    <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}">
                                    <p>Type: ${drink.strAlcoholic}</p>
                                    <p>Main Spirit: ${mainSpirit || 'N/A'}</p>
                                    <button class="view-details-btn" data-drink-id="${drink.idDrink}">View Specs</button>
                                `
                                drinkList.appendChild(drinkCard)
                            })

                            // Event listener for each drink card
                            const detailButtons = drinkList.querySelectorAll('.view-details-btn')
                            detailButtons.forEach(button => {
                                button.addEventListener('click', () => {
                                    const drinkId = button.getAttribute('data-drink-id')
                                    fetchDrinkDetails(drinkId)  // Fetch full drink details on click
                                })
                            })
                        }
                        resultsContainer.classList.remove('hidden')
                    } else {
                        drinkList.innerHTML = '<p>No results found.</p>'
                        resultsContainer.classList.remove('hidden')
                    }
                })
                .catch(error => {
                    console.error('Error fetching data:', error)
                    alert('Error fetching data. Please try again.')
                })
        } else {
            alert('Please enter a cocktail name.')
        }
    })

    document.getElementById('close-details-btn').addEventListener('click', function() {
        const drinkDetails = document.getElementById('drink-details')
        drinkDetails.classList.add('hidden')
    })

    // Function to display single drink details
    function displaySingleDrink(drink) {
        const drinkDetails = document.getElementById('drink-details')
        const drinkList = document.getElementById('drink-list')
        const drinkName = document.getElementById('drink-name')
        const drinkImage = document.getElementById('drink-image')
        const drinkType = document.getElementById('drink-type')
        const drinkGlass = document.getElementById('drink-glass')
        const drinkIngredients = document.getElementById('drink-ingredients')
        const drinkInstructions = document.getElementById('drink-instructions')

        drinkDetails.classList.remove('hidden')
        drinkList.innerHTML = ''
        drinkList.classList.add('hidden')

        drinkName.textContent = drink.strDrink
        drinkImage.src = drink.strDrinkThumb
        drinkType.textContent = `Type: ${drink.strAlcoholic || 'N/A'}`
        drinkGlass.textContent = `Glass: ${drink.strGlass || 'N/A'}`
        drinkIngredients.innerHTML = getIngredients(drink)
        drinkInstructions.textContent = drink.strInstructions || 'No instructions available.'
    }

    // Function to get main spirit from ingredients
    function getMainSpirit(drink) {
        for (let i = 1; i <= 15; i++) {
            const ingredient = drink[`strIngredient${i}`]
            if (ingredient && knownSpirits.includes(ingredient)) {
                return ingredient
            }
        }
        return null
    }

    // Function to get ingredients list
    function getIngredients(drink) {
        let ingredientsList = ''
        for (let i = 1; i <= 15; i++) {
            const ingredient = drink[`strIngredient${i}`]
            const measure = drink[`strMeasure${i}`]
            if (ingredient) {
                ingredientsList += `<li>${measure ? measure + ' ' : ''}${ingredient}</li>`
            }
        }
        return ingredientsList
    }

    // Fetch drink details
    function fetchDrinkDetails(drinkId) {
        fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkId}`)
            .then(response => response.json())
            .then(data => {
                const drink = data.drinks[0]
                displaySingleDrink(drink)  // For regular drinks
            })
            .catch(error => {
                console.error('Error fetching drink details:', error)
                alert('Error fetching drink details. Please try again.')
            })
    }

    // Spirit Buttons
    const spiritButtons = document.querySelectorAll('.spirit-button')

    spiritButtons.forEach(button => {
        button.addEventListener('click', () => {
            const spiritName = button.querySelector('span').textContent
            fetchSpirits(spiritName)
        })
    })

    function fetchSpirits(spirit) {
        fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${spirit}`)
            .then(response => response.json())
            .then(data => {
                const spiritResultsContainer = document.getElementById('spirit-results')
                const spiritDrinkList = document.getElementById('spirit-drink-list')
                spiritDrinkList.innerHTML = ''

                if (data.drinks) {
                    console.log(data.drinks)
                    data.drinks.forEach(drink => {
                        console.log(drink)
                        const mainSpirit = getMainSpirit(drink)
                        console.log(`Main Spirit: ${mainSpirit}`)
                        const drinkCard = document.createElement('div')
                        drinkCard.classList.add('drink-card')
                        drinkCard.innerHTML = `
                            <h3>${drink.strDrink}</h3>
                            <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}">
                            <p>Type: ${drink.strAlcoholic || 'N/A'}</p>
                            <p>Main Spirit: ${mainSpirit || 'N/A'}</p>
                            <button class="view-spirit-details-btn" data-drink-id="${drink.idDrink}">View Specs</button>
                        `
                        spiritDrinkList.appendChild(drinkCard)
                    })

                    // Show the results section
                    spiritResultsContainer.classList.remove('hidden')

                    // Add event listeners to the new buttons
                    const detailButtons = spiritDrinkList.querySelectorAll('.view-spirit-details-btn')
                    detailButtons.forEach(button => {
                        button.addEventListener('click', () => {
                            const drinkId = button.getAttribute('data-drink-id')
                            fetchSpiritDrinkDetails(drinkId)  // New function for spirit drinks
                        })
                    })
                } else {
                    spiritDrinkList.innerHTML = '<p>No results found.</p>'
                    spiritResultsContainer.classList.remove('hidden')
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error)
                alert('Error fetching data. Please try again.')
            })
    }

    // Fetch spirit drink details
    function fetchSpiritDrinkDetails(drinkId) {
        fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkId}`)
            .then(response => response.json())
            .then(data => {
                const drink = data.drinks[0]
                displaySingleSpiritDrink(drink)  // Pass to the new display function
            })
            .catch(error => {
                console.error('Error fetching spirit drink details:', error)
                alert('Error fetching spirit drink details. Please try again.')
            })
    }

    // Display details for spirit drinks
    function displaySingleSpiritDrink(drink) {
        const spiritDrinkDetails = document.getElementById('spirit-drink-details')
        const spiritDrinkList = document.getElementById('spirit-drink-list')
        const spiritDrinkName = document.getElementById('spirit-drink-name')
        const spiritDrinkImage = document.getElementById('spirit-drink-image')
        const spiritDrinkType = document.getElementById('spirit-drink-type')
        const spiritDrinkGlass = document.getElementById('spirit-drink-glass')
        const spiritDrinkIngredients = document.getElementById('spirit-drink-ingredients')
        const spiritDrinkInstructions = document.getElementById('spirit-drink-instructions')

        spiritDrinkDetails.classList.remove('hidden')
        spiritDrinkList.innerHTML = ''
        spiritDrinkList.classList.add('hidden')

        spiritDrinkName.textContent = drink.strDrink
        spiritDrinkImage.src = drink.strDrinkThumb
        spiritDrinkType.textContent = `Type: ${drink.strAlcoholic || 'N/A'}`
        spiritDrinkGlass.textContent = `Glass: ${drink.strGlass || 'N/A'}`
        spiritDrinkIngredients.innerHTML = getIngredients(drink)
        spiritDrinkInstructions.textContent = drink.strInstructions || 'No instructions available.'
    }

    // Close button for spirit drink details
    document.getElementById('close-spirit-details-btn').addEventListener('click', function() {
        const spiritDrinkDetails = document.getElementById('spirit-drink-details')
        spiritDrinkDetails.classList.add('hidden')
    })
})

