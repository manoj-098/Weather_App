const apiKey='c86a1c0935b8860c67f56bb92fa49cbd';
const apiURL='https://api.openweathermap.org/data/2.5/weather?q=';

 async function weather()
 {
   try{
     let city=document.querySelector("#searchbar").value;
     if(city=="")
     {
       alert("Please Enter a Valid Location");
     }
     else{
     let URL=apiURL+city+`&appid=${apiKey}&units=metric`;
     let web=await fetch(URL);
     let res=await web.json();
     document.querySelector("#searchbar").value='';
     // console.log(res);
     
    document.querySelector("#area").innerHTML=res.name;
    document.querySelector("#temp").innerHTML=Math.round(res.main.temp)+" ºC";
    document.querySelector("#hum").innerHTML=res.main.humidity+" %";
    document.querySelector("#w_speed").innerHTML=res.wind.speed+" Km/h";
    
   let img=document.querySelector('.weather_img');
   let val=res.weather[0].main;
   if(val=="Clear")
     img.src="images/clear.png";
   else if(val=="Clouds")
     img.src="images/clouds.png";
   else if(val=="Drizzle")
     img.src="images/drizzle.png";     
   else if(val=="Rain" || val=="Thunderstorms")
     img.src="images/rain.png";
   else if(val=="Snow")
     img.src="images/snow.png";
   else
     img.src="images/clear.png";   
     }    
    }
    catch(err)
    {
      alert("Entered Location maybe incorrect/Not Found");
      return;
    }
 }


 let bton=document.querySelector("#btn");


 demo();
 bton.addEventListener('click',demo);
 
 function demo()
 {
     weather();
 }
