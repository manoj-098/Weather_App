const apiKey = "c474c2f2796f4144b4635020230310";

const cityName = document.querySelector(".city_name h1");
const temp = document.querySelector(".temp span");
const conditionImg = document.querySelector(".temp img");
const conditionText = document.querySelector(".temp .condition_text");
const dayText = document.querySelector(".temp .day_text");
const daysList = document.querySelector(".days");
const searchInput = document.querySelector(".search input");
const searchIcon = document.querySelector(".search img");

let codePair = {
	1183: "drizzle.png",
	1153: "drizzle.png",
	1000: "clear.png",
	1003: "clear.png",
	1006: "clouds.png",
	1009: "clouds.png",
	1180: "rain.png",
	1183: "rain.png",
	1186: "rain.png",
	1189: "rain.png",
	1192: "rain.png",
	1195: "rain.png",
	1198: "rain.png",
	1201: "rain.png",
	1066: "snow.png",
	1210: "snow.png",
	1213: "snow.png",
	1216: "snow.png",
	1219: "snow.png",
	1222: "snow.png",
	1225: "snow.png",
	1237: "snow.png",
	1240: "snow.png",
	1243: "snow.png",
	1246: "snow.png",
	1249: "snow.png",
	1252: "snow.png",
	1255: "snow.png",
	1258: "snow.png",
};

searchIcon.addEventListener("click", () => {
  let city = searchInput.value.replace(/\s+/g, "-");
  fetchWeather("forecast.json", apiKey, city, 7, 0);
});

const fetchWeather = async (weather, key, query, days, Whichday) => {
  const queryCity = query ? query : "Uttarakhand";
  const url = `https://api.weatherapi.com/v1/${weather}?key=${key}&q=${queryCity}&days=${days}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch data: ${response.status} ${response.statusText}`
      );
    }
    const data = await response.json();
    if (data) {
      forecast(data);
    }
  } catch (error) {
    console.error(error);
  }
};

fetchWeather("forecast.json", apiKey, "Uttarakhand", 7, 0);

const info = async (data, whichDay) => {
  const value = data.forecast.forecastday[whichDay];
  if (whichDay == 0) {
    temp.innerText = data.current.temp_c + "ºC";
    conditionText.innerText = data.current.condition.text;
    cityName.textContent = searchInput.value
      ? searchInput.value
      : "Uttarakhand";

    const today = await fetchDay(data.location.localtime);
    dayText.innerText = today.day + ", " + today.month + " " + today.date;

    let start = today.hour;
    fetchHourly(value.hour, start);
  } else {
    temp.innerText = value.day.mintemp_c + "ºC / " + value.day.maxtemp_c + "ºC";
    conditionText.innerText = value.day.condition.text;
    cityName.textContent = searchInput.value
      ? searchInput.value
      : "Uttarakhand";

    const today = await fetchDay(value.date);
    dayText.innerText = today.day + ", " + today.month + " " + today.date;
    fetchHourly(value.hour, 0);
  }
};

const forecast = async (data) => {
  daysList.innerHTML = "";
  await info(data, 0);

  const forecastList = data.forecast.forecastday;
  forecastList.forEach((item, index) => {
    const forecastDay = fetchDay(item.date);
    const dayItem = document.createElement("div");
    dayItem.classList.add("box");
    index == 0 ? dayItem.classList.add("boxActive") : "";

    dayItem.addEventListener("click", async () => {
      document.querySelectorAll(".box").forEach((el, index) => {
        el.classList.remove("boxActive");
      });

      dayItem.classList.add("boxActive");
      await info(data, index);
    });

		const forecastDayCode = item.day.condition.code
		let forecastDayIcon = codePair[forecastDayCode];
    let forecastDayImageSrc = forecastDayIcon ? `images/${forecastDayIcon}` : "images/clear.png";

    dayItem.innerHTML = `<img src="${forecastDayImageSrc}" >
			<div class="info">
				<h2>${index == 0 ? "Today" : forecastDay.day}</h2>
				<p>${item.day.condition.text}</p>
			</div>`;
    daysList.appendChild(dayItem);
  });
};

const fetchDay = (data) => {
  const date = new Date(data);

  const day = date.toLocaleString("en-US", { weekday: "long" });
  const month = date.toLocaleString("en-US", { month: "long" });
  const dateOfMonth = date.getDate();
  const hour = date.getHours();

  returnDate = {
    day: day,
    month: month,
    date: dateOfMonth,
    hour: hour,
  };

  return returnDate;
};

const fetchHourly = (list, start) => {
  fechDetails(list, start);
  const hour = document.querySelector(".hour");
  hour.innerHTML = "";
  var i = start;
  var x = i;
  while (i < list.length) {
    let time;
    let hourNum = x % 12 == 0 ? 12 : x % 12;
    let period = x < 12 ? " AM" : " PM";
    if (hourNum < 10) {
      time = `0${hourNum}`;
    } else {
      time = `${hourNum}`;
    }

    time = time + period;
    let conditionCode = list[i].condition.code;

    let icon = codePair[conditionCode];
    let imageSrc = icon ? `images/${icon}` : "images/clear.png";

    const hourElement = document.createElement("div");
    hourElement.classList.add("hour_contents");
    hourElement.id = i;
    if (i === start) {
      hourElement.classList.add("boxActive");
    }
    hourElement.innerHTML = `<h3>${list[i].temp_c} ºC</h3>
															<img src=${imageSrc} alt="Weather Icon"/>
															<h3>${time}</h3>`;
    hour.appendChild(hourElement);
    i++;
    x++;

    hourElement.addEventListener("click", async () => {
      document.querySelectorAll(".hour_contents").forEach((el, index) => {
        el.classList.remove("boxActive");
      });
      hourElement.classList.add("boxActive");
      fechDetails(list, hourElement.id);
    });
  }
};

const fechDetails = (list, hour) => {
  const wind = document.querySelector(".wind h1");
  const humidity = document.querySelector(".humidity h1");
  wind.innerHTML = "";
  humidity.innerHTML = "";

  wind.innerHTML = `${list[hour].wind_kph}<span> kp/h</span>`;
  humidity.innerHTML = `${list[hour].humidity}<span> %</span>`;
};
