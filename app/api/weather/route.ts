import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');

  if (!city || city.trim() === '') {
    return NextResponse.json(
      { error: '도시 이름을 입력해주세요.' },
      { status: 400 }
    );
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: '서버에 API 키가 설정되지 않았습니다.' },
      { status: 500 }
    );
  }

  const encodedCity = encodeURIComponent(city.trim());
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&appid=${apiKey}&units=metric&lang=kr`;

  const res = await fetch(url, { cache: 'no-store' });
  const data = await res.json();

  if (!res.ok) {
    const message =
      data.cod === '404'
        ? '도시를 찾을 수 없습니다. 영문 도시명으로 입력해 주세요.'
        : data.message ?? '날씨 정보를 가져오는 데 실패했습니다.';
    return NextResponse.json({ error: message }, { status: res.status });
  }

  return NextResponse.json(data);
}
