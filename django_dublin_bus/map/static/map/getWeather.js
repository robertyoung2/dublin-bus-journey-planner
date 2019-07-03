function getWeather (temp, description, icon) {
    var current_temp_celcius = Math.round(temp - 273.15);
    document.getElementById("weatherTemp").innerHTML = current_temp_celcius + " &#8451" ;

    if(current_temp_celcius < 4){
        var thermo_icon = "temp0";
    }
    else if(current_temp_celcius < 12){
        var thermo_icon = "temp25";
    }
    else if(current_temp_celcius < 19){
        var thermo_icon = "temp50";
    }
    else if(current_temp_celcius < 23){
        var thermo_icon = "temp75";
    }
    else{
        var thermo_icon = "temp100";
    }

    // var thermometer_icon = "{% static 'images/weather_icons/'%}"
    // var weather_icon = "{% static 'images/weather_icons/'%}"+icon+'.svg';

    document.getElementById("weatherThermometer").src = weather_icons+thermo_icon+'.svg';
    document.getElementById("weatherIcon").src = weather_icons+icon+'.svg';

    // Capitalises the first letter of every word of the weather description
    // https://stackoverflow.com/a/29858893
    var re = /(\b[a-z](?!\s))/g;
    var weatherDescription = description;
    weatherDescription = weatherDescription.replace(re, function(x){return x.toUpperCase();});

    document.getElementById("weatherDescription").innerHTML = weatherDescription;

}