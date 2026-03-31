'use client';

import { useState, FormEvent } from 'react';

interface WeatherData {
  name: string;
  sys: { country: string };
  weather: { description: string; icon: string; main: string }[];
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    temp_min: number;
    temp_max: number;
  };
  wind: { speed: number };
  visibility: number;
}

const weatherBgMap: Record<string, string> = {
  Clear: 'from-yellow-300 to-orange-400',
  Clouds: 'from-gray-300 to-gray-500',
  Rain: 'from-blue-400 to-blue-700',
  Drizzle: 'from-blue-300 to-blue-500',
  Thunderstorm: 'from-gray-700 to-gray-900',
  Snow: 'from-blue-100 to-slate-300',
  Mist: 'from-gray-200 to-gray-400',
  Fog: 'from-gray-200 to-gray-400',
  Haze: 'from-yellow-100 to-gray-400',
  default: 'from-sky-400 to-blue-600',
};

export default function Home() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchWeather = async (e: FormEvent) => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError('');
    setWeather(null);

    try {
      const res = await fetch(
        `/api/weather?city=${encodeURIComponent(city.trim())}`
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? '날씨 정보를 불러오지 못했습니다.');
      } else {
        setWeather(data);
      }
    } catch {
      setError('서버와 통신 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const mainCondition = weather?.weather?.[0]?.main ?? 'default';
  const bgGradient =
    weatherBgMap[mainCondition] ?? weatherBgMap['default'];

  return (
    <main
      className={`min-h-screen bg-gradient-to-br ${bgGradient} flex items-center justify-center p-4 transition-all duration-700`}
    >
      <div className="w-full max-w-md">
        {/* 제목 */}
        <h1 className="text-4xl font-bold text-white text-center mb-8 drop-shadow-md">
          ☁️ 날씨 검색
        </h1>

        {/* 검색 폼 */}
        <form onSubmit={fetchWeather} className="flex gap-2 mb-6">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="도시 이름 입력 (예: 서울, Seoul, Tokyo)"
            className="flex-1 px-4 py-3 rounded-2xl text-gray-800 bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white shadow-lg placeholder:text-gray-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-3 bg-white/90 text-gray-800 font-semibold rounded-2xl shadow-lg hover:bg-white transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '검색 중…' : '검색'}
          </button>
        </form>

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-500/80 text-white px-5 py-3 rounded-2xl text-center shadow-md mb-4">
            {error}
          </div>
        )}

        {/* 날씨 카드 */}
        {weather && (
          <div className="bg-white/20 backdrop-blur-md rounded-3xl p-6 shadow-2xl text-white">
            {/* 도시명 */}
            <div className="text-center mb-4">
              <h2 className="text-3xl font-bold">
                {weather.name}
                <span className="text-xl font-normal ml-2 opacity-80">
                  {weather.sys.country}
                </span>
              </h2>
            </div>

            {/* 아이콘 & 온도 */}
            <div className="flex items-center justify-center gap-4 mb-4">
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
                width={80}
                height={80}
              />
              <div>
                <p className="text-6xl font-extrabold">
                  {Math.round(weather.main.temp)}°C
                </p>
                <p className="capitalize text-lg opacity-90 mt-1">
                  {weather.weather[0].description}
                </p>
              </div>
            </div>

            {/* 체감 온도 */}
            <p className="text-center text-sm opacity-80 mb-5">
              체감 온도 {Math.round(weather.main.feels_like)}°C &nbsp;|&nbsp;
              최저 {Math.round(weather.main.temp_min)}°C &nbsp;/&nbsp; 최고{' '}
              {Math.round(weather.main.temp_max)}°C
            </p>

            {/* 상세 정보 */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-white/20 rounded-2xl p-3">
                <p className="text-xs opacity-70 mb-1">습도</p>
                <p className="text-xl font-semibold">
                  {weather.main.humidity}%
                </p>
              </div>
              <div className="bg-white/20 rounded-2xl p-3">
                <p className="text-xs opacity-70 mb-1">풍속</p>
                <p className="text-xl font-semibold">
                  {weather.wind.speed} m/s
                </p>
              </div>
              <div className="bg-white/20 rounded-2xl p-3">
                <p className="text-xs opacity-70 mb-1">가시거리</p>
                <p className="text-xl font-semibold">
                  {(weather.visibility / 1000).toFixed(1)} km
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
