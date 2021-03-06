//url for Punk API (beer)
const punkURL = 'https://api.punkapi.com/v2/beers';

//function that performs an ajax call with the users search term as the query. if nothing is entered an error is thrown and all errors are logged to the console. if there is data
// it is displayed using functions below.
function getBeerData(userInput, callback) {
    const settings = {
      url: punkURL,
      data: {
        food: userInput,
        per_page: 5
      },
      dataType: 'JSON',
      type: 'GET',
      success: callback,
      error: function(jqXHR, textStatus, errorThrown){
        if (jqXHR.status == 400){
          $('.js-search-results').html(`<div class="js-beer-error">It Looks Like You Didn't Search For Anything!</div>`);
          }
        console.log(jqXHR, textStatus, errorThrown);
      }
      
    };
    $.ajax(settings);
  }
  
//url for Edamam Recipe Search API (food)
 const foodURL = 'https://api.edamam.com/search';

 //function that performs an ajax call with the expanded accordions food pairing for the query. if nothing is entered an error is thrown and all errors are logged to the console. 
 //if there is data it is displayed using functions below.
 function getFoodData(buttonVal, callback) {
    const settings = {
      url: foodURL,
      data: {
        q: buttonVal,
        app_id: 'c03f1683',
        app_key: '7bdba1c44d81525c792ad78924b3a87a',
        from: 0,
        to: 1
      },
      dataType: 'JSON',
      type: 'GET',
      success: callback,
      error: function(jqXHR, textStatus, errorThrown){
        console.log(jqXHR, textStatus, errorThrown);
      }
      
    };
    $.ajax(settings);
  }

//gets user input from the input feild and searches the item.food_pairing array for results that include the user searchTerm and creates a new array for each with those matches.
//then this function displays the info in an accordion with the first match from each array for simlpicity and to narrow down choices.
function displayBeerResults(item) {
    const searchTerm = $('input').val().trim(); 
//new array (matches) is created by filtering the item.food_pairing arrays (one for each of the 5 items being returned) for any element in the array that includes the user input.
    const matches = item.food_pairing.filter(x => x.toLowerCase().includes(`${searchTerm}`));
     return `
      <section class="js-accordion">
        <input type="image" src="${item.image_url}"/>
        <h4>${item.name}</h4>
        <p>${item.tagline} <span> ABV ${item.abv} / IBU ${item.ibu}<span></p> 
      </section>
      <article class="js-panel" hidden>
        <p>${item.description}</p>
        <p>Food Pairing:</p>
        <h4 class="js-food-pairing">${matches[0]}</h4>
        <section class="js-food-pairing-container">
        </section>
      </article>
   `;}

 
//maps over beer data and if there is data it displays results in .js-search-results container. Otherwise it throws an error.
function validateBeerData(data) {
  const searchTerm = $('input').val().trim();
  const result = data.map((beer, i) => displayBeerResults(beer));
  if (data.length === 0){
    $('.js-search-results').html(`<div class="js-beer-error">Sorry! We couldn't find any beers that pair with "${searchTerm}"</div>`);
  } else {
  $('.js-search-results').html(result);
  }
}

//performs a callback each time the user presses a key after 3rd keypress. this gives the look of instant search. sets user input as a string value and passes that into the getBeerData function as a variable for
// query
function beerSearch() {
  $('.js-search-form').keyup(event => {
    event.preventDefault();
    const userInput = $('.js-query').val().trim(); 
    $(this).val("");
    if (userInput.length < 3) return;
    getBeerData(userInput, validateBeerData);
  });
}


//expands accordion for selected beer. toggles closed any others that are not currently selected.
function showBeerDescription(){
  $('.js-search-results').on('click', '.js-accordion', function(){
    $(this).next().toggle('slide');
    $('.js-panel').not($(this).next()).hide('slow');
  });
}

//takes food pairing text from currently open accordion and passes that value into the getFoodData ajax call
function queryForFood(){
  $('.js-search-results').on('click', '.js-accordion', function(){
    const buttonVal = $(this).next().find('.js-food-pairing').text();
   getFoodData(buttonVal, displayFoodData);
  });
}

//maps over food data and if there is data it appends food info to the currently expanded accordion. Otherwise it throws an error.
function displayFoodData(data){
  const results = validateFoodData(data);
  $('.js-food-pairing-container').html(results);
  }

//returns html for the page based on the hits array being empty or not
function validateFoodData(items){
  if (items.hits.length === 0) {
    return `<div class="js-food-error">You are seeing this for one of two reasons. 
    First, no recipe could be found. Second, the meal only needs the ingredients in the title.</div>`
  } else {
  return `
    <a href="${items.hits[0].recipe.url}"><input type="image" src="${items.hits[0].recipe.image}" alt="${items.hits[0].recipe.image}"/>Time to Make: ${items.hits[0].recipe.totalTime} min.</a>
    <ul> Ingredients Needed:
      ${items.hits[0].recipe.ingredientLines.map( ingredient => `<li>${ingredient}</li>`).join("")}
    </ul>
  `
  ;}
}

//loads all functions that are needed to use the webapp.
function renderPage(){
  beerSearch();
  showBeerDescription();
  queryForFood();
}

$(renderPage);