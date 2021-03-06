import React, {useCallback, useState, useEffect} from 'react';
import {useParams} from "react-router-dom";
import useHttp from "../../hooks/http.hook";
import './WeatherWidget.scss';
import { dictionary } from '../../data/dictionary';

const WeatherWidget = ({language, countryData}) => {
    const {id} = useParams();
    const [countryWeather, setCountryWeather] = useState({});
    const {loading, request} = useHttp();

    const getWeatherData = useCallback(
        async () => {
            try {
                const weatherURL = `http://api.openweathermap.org/data/2.5/weather?q=${id}&APPID=03c58e90c746d993b00ae6c40ccb8326`;
                fetch(weatherURL)
                    .then(res => res.json())
                    .then(data => {
                        let weather = {};
                        weather.temperature = `${(data.main.temp - 273.15).toFixed(0)} °C`;
                        weather.feels = `${(data.main.feels_like - 273.15).toFixed(0)} °C`
                        weather.humidity = `${data.main.humidity} %`;
                        weather.visibility = `${data.visibility} m`;
                        weather.wind = `${data.wind.speed} km/h`;
                        weather.today = data.weather[0].description;
                        weather[`owf owf-${data.weather[0].id} owf-5x`] = '';
                        setCountryWeather(weather);
                    })
            } catch (e) {
                console.log(e);
            }
        },
        [request]
    );

    useEffect(() => {
        getWeatherData();
    }, []);

    return (
        <div className='card text-white bg-primary mb-3 weather-widget'>
            <div className='card-body'>
                <h4 className='card-title'>{dictionary[language]['weather-in']}</h4>
                <i id='weather-icon'
                   className={Object.keys(countryWeather)[Object.keys(countryWeather).length - 1]}></i>
                    {
                        Object.keys(countryWeather).map(itemKey => {
                            return (
                                <div key={itemKey} id={itemKey} className='weather-parameter'>
                                    <span>{dictionary[language][itemKey]} </span>
                                    <span>{countryWeather[itemKey]}</span>
                                </div>
                            )
                        })
                    }
            </div>
        </div>
    )
}

export default WeatherWidget;
