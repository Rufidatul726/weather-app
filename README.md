# Weather Dashboard

## Overview
This is a one-page React web app that allows users to view weather information for multiple cities simultaneously. The application provides real-time weather updates and allows users to add or remove cities while switching between Celsius and Fahrenheit.

## Features
- **Add and remove cities**: Users can search and add cities to the dashboard.
- **Toggle between Celsius and Fahrenheit**: Switch between temperature units easily.
- **Responsive grid layout**: The dashboard adapts to different screen sizes.
- **City search with autocomplete**: Find cities quickly with an autocomplete search.
- **Weather cards displaying**:
  - Temperature
  - Weather condition with an icon
  - Humidity level
  - Wind speed
- **Loading state**: Indicates when data is being fetched.
- **Persistent city list**: Cities are saved in localStorage to retain user preferences.
- **Dark mode support**: Users can switch between light and dark themes.
- **Error handling**: Provides alerts for invalid city names or failed API requests.

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/weather-dashboard.git
   cd weather-dashboard
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env.local` file and add the following environment variables:
   ```sh
   NEXT_PUBLIC_OPENWEATHER_API_KEY=your_openweather_api_key
   NEXT_PUBLIC_RAPIDAPI_KEY=your_rapidapi_key
   ```
4. Start the development server:
   ```sh
   npm run dev
   ```

## Usage
- Visit the deployed app: **[Weather Dashboard](https://weather-dashboard-one-ruddy.vercel.app/)**
- Use the search bar to find and add cities.
- Click on a city to view detailed weather information.
- Toggle between Celsius and Fahrenheit using the switch.
- Remove cities by clicking the "X" button.
- Weather data updates automatically when a city is added.
- Switch between light and dark mode for better visibility.

## API Usage
- **OpenWeather API**: Fetches weather data.
- **RapidAPI City Search**: Provides city search and autocomplete functionality.

## Technologies Used
- **React**
- **Next.js**
- **Tailwind CSS**
- **OpenWeather API**
- **RapidAPI City Search**
- **LocalStorage** for persistent data storage


## Author
Rufidatul Radium - radiumrufidatul@gmail.com