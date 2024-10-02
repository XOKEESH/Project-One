document.addEventListener('DOMContentLoaded', () => {
    const knownSpirits = ['Tequila', 'Vodka', 'Gin', 'Bourbon', 'Whiskey', 'Rum', 'Mezcal', 'Brandy']

    document.getElementById('search-btn').addEventListener('click', function() {
        const searchTerm = document.getElementById('search').value

        if (searchTerm) {
            fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchTerm}`)
                .then(response => response.json())
                .then(data => {
                    const resultsContainer = document.getElementById('results')
                    const drinkList = document.getElementById('drink-list')
                    const drinkDetails = document.getElementById('drink-details')

                    console.log('Drink List Element:', drinkList);
                    console.log('Drink Details Element:', drinkDetails)


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
                                    const selectedDrink = data.drinks.find(d => d.idDrink === drinkId)
                                    displaySingleDrink(selectedDrink)
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
   
    // Function: full details for a single drink
    function displaySingleDrink(drink) {
        const drinkDetails = document.getElementById('drink-details');
        const drinkList = document.getElementById('drink-list'); // Get the drink list
        const drinkName = document.getElementById('drink-name');
        const drinkImage = document.getElementById('drink-image');
        const drinkType = document.getElementById('drink-type');
        const drinkGlass = document.getElementById('drink-glass');
        const drinkIngredients = document.getElementById('drink-ingredients');
        const drinkInstructions = document.getElementById('drink-instructions');
    
        drinkDetails.classList.remove('hidden'); // Show drink details
        drinkList.innerHTML = ''
        drinkList.classList.add('hidden'); // Hide the drink list
    
        drinkName.textContent = drink.strDrink;
        drinkImage.src = drink.strDrinkThumb;
        drinkType.textContent = `Type: ${drink.strAlcoholic}`;
        drinkGlass.textContent = `Glass: ${drink.strGlass}`;
        drinkIngredients.innerHTML = getIngredients(drink);
        drinkInstructions.textContent = drink.strInstructions;
    }

    // Function: get main spirit from ingredients
    function getMainSpirit(drink) {
        for (let i = 1; i <= 15; i++) {
            const ingredient = drink[`strIngredient${i}`]
            if (ingredient && knownSpirits.includes(ingredient)) {
                return ingredient
            }
        }
        return null
    }

    // Function: ingredients for a single drink
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
})
