const searchButton = document.querySelector(".search-btn");
const cityInput = document.querySelector(".city-input");
const currentWeatherData = document.querySelector(".current-weather");
let currentDate =  dayjs().format('MMM-DD-YYYY');
const API_KEY ="313e19582894eb8e201b929fa986e291";
const weatherCardsDiv = document.querySelector(".weather-cards");
let contHistEl = $('.cityHist');
const current_Location = document.querySelector(".location-btn");
const cityList =[];
const butt_arr =[];



var timeDisplayEl = $('#time-display');

//
//const GEO_API="AIzaSyA1lo2L-7mxPdDWeieZjKek-eBSVH9QWD0";
const API_KEY1 = "42fc323d-4d1a-441d-a3cf-f4cf388c4ed2";

/*
const GoogleURL = `https://maps.googleapis.com/maps/api/geocode/json?address=Campbell,+CA&key=${GEO_API}`;
fetch(GoogleURL)
.then(function(response)
{
  return response.json();
})
.then(function(data){
  console.log(data);

})

//37.2871651
//-121.9499568
*/

function getLocation() {
  if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(showPosition);
  } else { 
   // x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  console.log(position.coords.latitude+" "+  position.coords.longitude);
}

//getLocation();



    //This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
    function calcCrow(lat1, lon1, lat2, lon2) 
    {
      var R = 6371; // km
      var dLat = toRad(lat2-lat1);
      var dLon = toRad(lon2-lon1);
      var lat1 = toRad(lat1);
      var lat2 = toRad(lat2);

      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c;
      return d*0.621371;
    }

    // Converts numeric degrees to radians
    function toRad(Value) 
    {
        return Value * Math.PI / 180;
    }









/*
<select class="drop-down-menu" name="radius-location" id="radius-location">
          <option value="none" selected> Choose a distance</option>
          <option value="5miles">5 Miles</option>
          <option value="10 miles">10 Miles</option>
          <option value="20miles">20 Miles</option>
        </select>



        var e = document.getElementById("elementId");
var value = e.options[e.selectedIndex].value;
var text = e.options[e.selectedIndex].text;

*/

let e = document.getElementById("radius-location");





function getOption() {

  
  var value = e.options[e.selectedIndex].text;
  return value;
}

function getCharingPointDetail(lat2,lon2)
{

  navigator.geolocation.getCurrentPosition(
    position => {
        const { latitude, longitude } = position.coords; // Get coordinates of user location

       // console.log("la: "+ latitude+" lo: "+longitude);
        const OPENCHARGE_URL = `https://api.openchargemap.io/v3/poi/?output=json&key=${API_KEY1}&latitude=${lat2}&longitude=${lon2}&levelid=3
        &distance=${getOption()}&maxresults=5&countryid=US`
        
        //calcCrow(lat1, lon1, lat2, lon2) 

        console.log(" value: "+getOption());
    
        fetch(OPENCHARGE_URL)
        .then(function(response)
        {
          return response.json();
        })
        .then(function(data){
          console.log(data);
         // console.log(data[0].AddressInfo.Title)
        
          for (let index = 0; index < data.length; index++) {
            //DistanceUnit
            //data[index].AddressInfo.DistanceUnit=1;
            console.log(data[index].AddressInfo.AddressLine1+" "+data[index].AddressInfo.Town+" "+data[index].AddressInfo.StateOrProvince+" "+data[index].AddressInfo.Postcode)
            console.log("Distance: "+ (calcCrow(latitude,longitude,data[index].AddressInfo.Latitude,data[index].AddressInfo.Longitude)).toFixed(2)+" miles");
            console.log("Charge Level: "+ (data[index].Connections[0].Level.Title));
            if(data[index].OperatorInfo!=null)
            {
            console.log("Providing Capability: "+ (data[index].OperatorInfo.Title));
           
            }
            console.log("Number Charging station: "+ (data[index].NumberOfPoints));
            console.log("Cost "+ (data[index].UsageCost));
            console.log("\n");
         
            
            
          }
        })
     
        
    },
    error => { // Show alert if user denied the location permission
        if (error.code === error.PERMISSION_DENIED) {
            alert("Geolocation request denied. Please reset location permission to grant access again.");
        } else {
            alert("Geolocation request error. Please reset location permission.");
        }
    });

    

 

}




function displayTimeDashBoard()
{
var rightNow = dayjs().format('MMM DD, YYYY [at] hh:mm:ss a');
timeDisplayEl.text(rightNow);
setInterval(displayTimeDashBoard,1000);
}
displayTimeDashBoard();


function getWeather(citiName,latitude,longtitude)
{
 
  
    const WEATHER_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longtitude}&appid=${API_KEY}`;
    fetch(WEATHER_URL)
    .then(function(response)
    {
        return response.json();
    })
    .then(function(data){
      //  console.log(citiName);
        
       // console.log(data);
        //console.log(data.name);
        //console.log((((data.main.temp- 273.15) * 9/5) + 32).toFixed(0)+"°F");
        //console.log(data.main.humidity);
        $('.weather-detail h3').text(citiName.toUpperCase()+" ("+currentDate+")");
        $('.2').text((((data.main.temp- 273.15) * 9/5) + 32).toFixed(0)+"°F");
        $('.3').text(data.wind.speed);
        $('.4').text(data.main.humidity);
        $('img').attr('src',`https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`);
        $('.weather-icon h4').text(data.weather[0].description.toUpperCase());
        
    })
}


function getForecast(lat1,lon1)
{
  
  const FORECAST_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat1}&lon=${lon1}&appid=${API_KEY}`;

  fetch(FORECAST_URL)
  .then(function(response)
  {
      return response.json();
  })
  .then(function(data){

    let foreCastDataList=[];
      console.log(data);
      const fiveDay_forecast=[];
       for (let i = 0; i < data.list.length; i++) {
        //console.log("---"+data.list[i].dt_txt);
        const  foreCastDate = new Date(data.list[i].dt_txt).getDate();

        if(!fiveDay_forecast.includes(foreCastDate))
        {
          fiveDay_forecast.push(foreCastDate); 
          foreCastDataList.push(data.list[i]);
        }
       
       }
     
       for (let index = 0; index < fiveDay_forecast.length; index++) {
       $('.card'+index+' h3').text(foreCastDataList[index].dt_txt.split(" ")[0]);
       var url_icon = "https://openweathermap.org/img/wn/"+foreCastDataList[index].weather[0].icon+"@2x.png";
       $('.card'+index+' img').attr('src',url_icon);
       $(('.card'+index)+ ' .2').text((((foreCastDataList[index].main.temp- 273.15) * 9/5) + 32).toFixed(0)+"°F");
      $(('.card'+index)+ ' .3').text(foreCastDataList[index].wind.speed);
      $(('.card'+index)+ ' .4').text(foreCastDataList[index].main.humidity);
    // console.log(foreCastDataList[index]);
      
      
     }
  })
}


function getCitylocation()
{
      
        var cityName = cityInput.value.trim();
        if(!cityName) return; 
        const GEO_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

        fetch(GEO_URL)
        .then(function(response){
            return response.json();
        })
        .then(function(data)
        {
            if(!data.length)
            return alert (`${cityName} is invalid, please re-check the input`);
      //  var namecity =data[0].name;
       // console.log("name: "+namecity);
            console.log(data);
           const {name,lat,lon} =data[0];
         //    console.log("Name: "+ name);
       //   console.log("Lat: "+lat);
         //   console.log("Long: "+lon);

         const data_object = {
          cityName: name,
          latitude: lat,
          longtitude: lon
          }; 
         

           if(!butt_arr.includes(cityName))
           {
            butt_arr.push(cityName);
            cityList.push(data_object);
           }
        
           for (let index = 0; index < butt_arr.length; index++) {
          //  console.log(butt_arr[index]+"----");
            
           }
        
        //   console.log(butt_arr.length+"----");
       
          localStorage.setItem('city', JSON.stringify(cityList));
          console.log(cityList.length+" length");
           getWeather(cityName,lat,lon);
           getForecast(lat,lon);
           getCharingPointDetail(lat,lon);
           getHistory();

        })
        .catch(()=>
        {
            alert("An error occured while fetching the coordinates!");
        });

     

}
//cityList.push(data_object);



const getUserCoordinates = () => {
  navigator.geolocation.getCurrentPosition(
      position => {
          const { latitude, longitude } = position.coords; // Get coordinates of user location
          // Get city name from coordinates using reverse geocoding API
          const API_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
          fetch(API_URL).then(response => response.json()).then(data => {
              const { name } = data[0];

              getWeather(name,latitude,longitude);
            getForecast(latitude,longitude);
            getCharingPointDetail(latitude,longitude);
          }).catch(() => {
              alert("An error occurred while fetching the city name!");
          });
      },
      error => { // Show alert if user denied the location permission
          if (error.code === error.PERMISSION_DENIED) {
              alert("Geolocation request denied. Please reset location permission to grant access again.");
          } else {
              alert("Geolocation request error. Please reset location permission.");
          }
      });
}

 


function getHistory() {

  contHistEl.empty();
  for (let i = 0; i < cityList.length; i++) {
  
		var btnEl = $('<button>').text(`${cityList[i].cityName}`)
	
		btnEl.addClass('btn btn-outline-secondary histBtn');
    btnEl.attr('id',i);
		btnEl.attr('type', 'button');

		contHistEl.append(btnEl);


    

  }



  var retrievedObject = localStorage.getItem('city');
          
  // CONVERT STRING TO REGULAR JS OBJECT
  var parsedObject = JSON.parse(retrievedObject);
  

  $('.histBtn').on("click", function (event) {
		event.preventDefault();
 
   // console.log($(this).attr('id'));
   // console.log($(this).text());

    getWeather(parsedObject[$(this).attr('id')].cityName,parsedObject[$(this).attr('id')].latitude,parsedObject[$(this).attr('id')].longtitude);
    getForecast(parsedObject[$(this).attr('id')].latitude,parsedObject[$(this).attr('id')].longtitude);
    getCharingPointDetail(parsedObject[$(this).attr('id')].latitude,parsedObject[$(this).attr('id')].longtitude);

  
	});
}





searchButton.addEventListener('click',getCitylocation);
current_Location.addEventListener('click',getUserCoordinates);
