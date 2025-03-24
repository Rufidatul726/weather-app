"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { X, Loader2, Droplets, Wind } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

// Types
interface WeatherData {
  city: string
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
  icon: string
}

interface City {
  name: string
  country: string
}

export default function WeatherDashboard() {
  const [cities, setCities] = useState<string[]>([])
  const [weatherData, setWeatherData] = useState<Record<string, WeatherData>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<City[]>([])
  const [isCelsius, setIsCelsius] = useState(true)
  const [isSearching, setIsSearching] = useState(false)

  // Load cities from localStorage on initial render
  useEffect(() => {
    const savedCities = localStorage.getItem("weatherCities")
    if (savedCities) {
      setCities(JSON.parse(savedCities))
    }
  }, [])

  // Save cities to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("weatherCities", JSON.stringify(cities))
  }, [cities])

  // Fetch weather data for all cities
  useEffect(() => {
    cities.forEach((city) => {
      if (!weatherData[city]) {
        fetchWeatherData(city)
      }
    })
  }, [cities])

  const fetchWeatherData = async (city: string) => {
    setLoading((prev) => ({ ...prev, [city]: true }));
  
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
      );
      const data = await response.json();
  
      if (response.ok) {
        const weather: WeatherData = {
          city: data.name,
          temperature: Math.round(data.main.temp),
          condition: data.weather[0].description,
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
          icon: data.weather[0].icon, // OpenWeather provides icon codes
        };
  
        setWeatherData((prev) => ({ ...prev, [city]: weather }));
      } else {
        console.error("Error fetching weather data:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading((prev) => ({ ...prev, [city]: false }));
    }
  };

  const searchCities = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://city-search2.p.rapidapi.com/city/autocomplete?input=${query}`,
        {
          headers: {
            "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPIDAPI_KEY || "",
            "x-rapidapi-host": "city-search2.p.rapidapi.com",
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch cities");
      const data = await response.json();
      setSearchResults(data.data.map((item: any) => ({ name: item.name, country: item.country }))); 
    } catch (error) {
      console.error("Error fetching cities:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    searchCities(query)
  }

  // Add a city to the dashboard
  const addCity = (city: string) => {
    if (!cities.includes(city)) {
      setCities((prev) => [...prev, city])
      fetchWeatherData(city)
    }
    setSearchQuery("")
    setSearchResults([])
  }

  // Remove a city from the dashboard
  const removeCity = (city: string) => {
    setCities((prev) => prev.filter((c) => c !== city))
    setWeatherData((prev) => {
      const newData = { ...prev }
      delete newData[city]
      return newData
    })
  }

  // Convert temperature based on selected unit
  const formatTemperature = (temp: number) => {
    if (isCelsius) {
      return `${temp}°C`
    } else {
      const fahrenheit = Math.round((temp * 9) / 5 + 32)
      return `${fahrenheit}°F`
    }
  }

  // Get weather icon based on condition
  const getWeatherIcon = (iconCode: string) => {
    return (
      <img
        src={`https://openweathermap.org/img/wn/${iconCode}@2x.png`}
        alt="Weather Icon"
        className="h-12 w-12"
      />
    );
  };
  

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Weather Dashboard</h1>

      {/* Search and Unit Toggle */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 items-start md:items-center">
        <div className="relative flex-1">
          <div className="flex">
            <Input
              placeholder="Search for a city..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full"
            />
            {isSearching && (
              <div className="absolute right-3 top-2.5">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-background border rounded-md shadow-lg">
              <ul>
                {searchResults.map((city) => (
                  <li
                    key={`${city.name}-${city.country}`}
                    className="px-4 py-2 hover:bg-muted cursor-pointer"
                    onClick={() => addCity(city.name)}
                  >
                    {city.name}, {city.country}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Label htmlFor="unit-toggle">°C</Label>
          <Switch id="unit-toggle" checked={!isCelsius} onCheckedChange={(checked) => setIsCelsius(!checked)} />
          <Label htmlFor="unit-toggle">°F</Label>
        </div>
      </div>

      {/* Weather Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {cities.map((city) => (
          <Card key={city} className={cn("overflow-hidden", loading[city] && "opacity-70")}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{city}</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => removeCity(city)} className="h-8 w-8">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove {city}</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading[city] ? (
                <div className="flex justify-center items-center h-32">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : weatherData[city] ? (
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center mb-4">
                    {getWeatherIcon(weatherData[city].icon)}
                    <span className="text-4xl font-bold ml-2">{formatTemperature(weatherData[city].temperature)}</span>
                  </div>
                  <p className="text-lg text-center mb-2">{weatherData[city].condition}</p>
                </div>
              ) : (
                <div className="flex justify-center items-center h-32">
                  <p>No data available</p>
                </div>
              )}
            </CardContent>
            {!loading[city] && weatherData[city] && (
              <CardFooter className="flex justify-between pt-0">
                <div className="flex items-center">
                  <Droplets className="h-4 w-4 mr-1 text-blue-500" />
                  <span>{weatherData[city].humidity}%</span>
                </div>
                <div className="flex items-center">
                  <Wind className="h-4 w-4 mr-1 text-gray-500" />
                  <span>{weatherData[city].windSpeed} km/h</span>
                </div>
              </CardFooter>
            )}
          </Card>
        ))}

        {cities.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center p-8 border rounded-lg border-dashed">
            <p className="text-muted-foreground mb-4">No cities added yet</p>
            <p className="text-sm text-muted-foreground">Search for a city to add it to your dashboard</p>
          </div>
        )}
      </div>
    </div>
  )
}

