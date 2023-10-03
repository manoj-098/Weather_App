const apiKey = "c474c2f2796f4144b4635020230310";

const cityName = document.querySelector(".city_name h1");
const temp = document.querySelector(".temp span");
const conditionImg = document.querySelector(".temp img");
const conditionText = document.querySelector(".temp .condition_text");
const dayText = document.querySelector(".temp .day_text");
const daysList = document.querySelector(".days");
const searchInput = document.querySelector(".search input");
const searchIcon = document.querySelector(".search img");

searchIcon.addEventListener("click", () => {
  let city = searchInput.value.replace(/\s+/g, "-");
  console.log(city);
  fetchWeather("forecast.json", apiKey, city, 7, 0);
});

const fetchWeather = async (weather, key, query, days, Whichday) => {
  const queryCity = query ? query : "New-York";
  const url = `http://api.weatherapi.com/v1/${weather}?key=${key}&q=${queryCity}&days=${days}`;
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

fetchWeather("forecast.json", apiKey, "New-York", 7, 0);

const info = async (data, whichDay) => {
  const value = data.forecast.forecastday[whichDay];
  if (whichDay == 0) {
    temp.innerText = data.current.temp_c + "ºC";
    conditionText.innerText = data.current.condition.text;
    cityName.textContent = searchInput.value ? searchInput.value : "New York";

    const today = await fetchDay(data.location.localtime);
    dayText.innerText = today.day + ", " + today.month + " " + today.date;

    let start = today.hour;
    fetchHourly(value.hour, start);
  } else {
    temp.innerText = value.day.mintemp_c + "ºC / " + value.day.maxtemp_c + "ºC";
    conditionText.innerText = value.day.condition.text;
    cityName.textContent = searchInput.value ? searchInput.value : "New York";

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

    dayItem.innerHTML = `<img src="./images/clouds.png" >
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
  const hour = document.querySelector(".hour");
  hour.innerHTML = "";
  let i = start;
  while (i < list.length) {
    let time;
    if (i < 10) {
      time = i <= 12 ? `0${i} AM` : `0${i} PM`;
    } else {
      time = i <= 12 ? `${i}  AM` : `${i}  PM`;
    }
    const hourElement = document.createElement("div");
    hourElement.classList.add("hour_contents");
    hourElement.innerHTML = `<h3>${list[i].temp_c} ºC</h3>
															<img src="images/clear.png" />
															<h3>${time}</h3>`;
    hour.appendChild(hourElement);
    i++;
  }
};
