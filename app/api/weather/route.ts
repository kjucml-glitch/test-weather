import { NextRequest, NextResponse } from 'next/server';

const cityNameMap: Record<string, string> = {
  서울: 'Seoul',
  부산: 'Busan',
  인천: 'Incheon',
  대구: 'Daegu',
  대전: 'Daejeon',
  광주: 'Gwangju',
  울산: 'Ulsan',
  수원: 'Suwon',
  세종: 'Sejong',
  제주: 'Jeju',
  창원: 'Changwon',
  전주: 'Jeonju',
  청주: 'Cheongju',
  춘천: 'Chuncheon',
  포항: 'Pohang',
  김해: 'Gimhae',
  천안: 'Cheonan',
  안양: 'Anyang',
  평택: 'Pyeongtaek',
  의정부: 'Uijeongbu',
  강릉: 'Gangneung',
  원주: 'Wonju',
  목포: 'Mokpo',
  여수: 'Yeosu',
  순천: 'Suncheon',
  군산: 'Gunsan',
  익산: 'Iksan',
  경주: 'Gyeongju',
  거제: 'Geoje',
  양산: 'Yangsan',
  구미: 'Gumi',
  안동: 'Andong',
  속초: 'Sokcho',
  남원: 'Namwon',
  통영: 'Tongyeong',
  도쿄: 'Tokyo',
  오사카: 'Osaka',
  뉴욕: 'New York',
  런던: 'London',
  파리: 'Paris',
  베이징: 'Beijing',
  상하이: 'Shanghai',
  방콕: 'Bangkok',
  싱가포르: 'Singapore',
  시드니: 'Sydney',
  로스앤젤레스: 'Los Angeles',
  샌프란시스코: 'San Francisco',
  시카고: 'Chicago',
  베를린: 'Berlin',
  로마: 'Rome',
  마드리드: 'Madrid',
  모스크바: 'Moscow',
  두바이: 'Dubai',
  홍콩: 'Hong Kong',
  타이베이: 'Taipei',
  하노이: 'Hanoi',
  호치민: 'Ho Chi Minh City',
  자카르타: 'Jakarta',
  쿠알라룸푸르: 'Kuala Lumpur',
  마닐라: 'Manila',
  뭄바이: 'Mumbai',
  델리: 'Delhi',
  카이로: 'Cairo',
  이스탄불: 'Istanbul',
  바르셀로나: 'Barcelona',
  암스테르담: 'Amsterdam',
  취리히: 'Zurich',
  토론토: 'Toronto',
  밴쿠버: 'Vancouver',
  멜버른: 'Melbourne',
  오클랜드: 'Auckland',
  하와이: 'Honolulu',
};

function resolveCity(input: string): string {
  const trimmed = input.trim();
  return cityNameMap[trimmed] ?? trimmed;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: '서버에 API 키가 설정되지 않았습니다.' },
      { status: 500 }
    );
  }

  let url: string;

  if (lat && lon) {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);
    if (isNaN(latitude) || isNaN(longitude)) {
      return NextResponse.json(
        { error: '유효하지 않은 좌표입니다.' },
        { status: 400 }
      );
    }
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lang=kr`;
  } else if (city && city.trim() !== '') {
    const resolvedCity = resolveCity(city);
    const encodedCity = encodeURIComponent(resolvedCity);
    url = `https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&appid=${apiKey}&units=metric&lang=kr`;
  } else {
    return NextResponse.json(
      { error: '도시 이름 또는 좌표를 입력해주세요.' },
      { status: 400 }
    );
  }

  const res = await fetch(url, { cache: 'no-store' });
  const data = await res.json();

  if (!res.ok) {
    const message =
      data.cod === '404'
        ? '도시를 찾을 수 없습니다. 도시명을 다시 확인해 주세요.'
        : data.message ?? '날씨 정보를 가져오는 데 실패했습니다.';
    return NextResponse.json({ error: message }, { status: res.status });
  }

  return NextResponse.json(data);
}
