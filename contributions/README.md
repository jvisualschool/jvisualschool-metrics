# GitHub 3D Isometric Contributions Calendar (Mock)

GitHub 프로필의 **Contributions calendar**를 참고해, **3D Isometric 바 차트 + 2D Heatmap**을 **단일 HTML 파일**로 구현한 목업입니다.

- 데모 파일: `index.html`
- 실제 데이터 연동: GitHub GraphQL (토큰 필요)

## 1) 현재 완료된 기능

- GitHub 스타일 헤더
  - `N contributions in the last year`
  - `3D / Grid` 토글
  - `Contribution settings` (목업 버튼)
- 3D Isometric chart (상단)
  - **jasonlong/isometric-contributions 방식으로 구현** (obelisk.js로 캔버스 렌더링)
    - Repo: https://github.com/jasonlong/isometric-contributions
    - obelisk.js: https://github.com/nosir/obelisk.js
  - 색상 스케일(0, 1–3, 4–6, 7–9, 10+)
  - (현재) 3D 캔버스는 목업 데이터 기반 렌더링
  - 3D 캔버스 **hover 툴팁** 지원
    - 방식: 마우스 좌표를 isometric 투영을 역으로 근사(inverse projection)하여 `(week, day)` 셀을 추정
    - 원본 확장처럼 GitHub DOM 툴팁을 재사용할 수 없어서, 정적 페이지에서는 이 방식이 현실적인 대체안
  - (참고) 원 repo는 GitHub DOM에서 컬러/카운트를 파싱하지만, 본 프로젝트는 **정적 페이지**이므로 데이터 배열로 직접 주입
- 통계 패널 (오른쪽)
  - total / busiest day / longest streak / current streak 계산
- 2D Heatmap (하단)
  - 월 라벨, 요일 라벨, 범례(less/more)
  - cell title tooltip
- 반응형
  - 모바일(<768px): 3D 차트 숨김, 2D만 표시

## 2) 엔트리(기능) URI

- 메인 페이지
  - `index.html`

- 외부 라이브러리/출처
  - isometric-contributions: https://github.com/jasonlong/isometric-contributions
  - License(MIT): https://github.com/jasonlong/isometric-contributions/blob/master/LICENSE
  - obelisk.js: https://github.com/nosir/obelisk.js

- 외부 API(실데이터 연동 시)
  - GitHub GraphQL API: https://api.github.com/graphql
  - GitHub GraphQL Docs: https://docs.github.com/en/graphql

## 3) 아직 미구현(권장 고도화)

- `Contribution settings` 실제 드롭다운 UI
- GitHub 실제 UI와 동일한 월 라벨 spacing/배치 정밀 튜닝
- 3D 바의 정확한 음영/그림자(더 사실적인 퍼스펙티브)
- 접근성(키보드 탐색, 스크린리더용 상세 ARIA) 고도화

## 4) 토큰으로 실데이터 붙이는 방법

`index.html` 내부에 이미 준비된 함수가 있습니다.

```js
async function fetchRealContributions(username, token) {
  // POST https://api.github.com/graphql
}

// 사용 예시(주석 해제)
// const token = 'YOUR_GITHUB_TOKEN';
// fetchRealContributions('jvisualschool', token)
//   .then(realDays => {
//     renderIsometric(realDays);
//     renderHeatmap(realDays);
//     applyStats(calcStats(realDays));
//   })
//   .catch(console.error);
```

- GitHub 토큰 생성 URL: https://github.com/settings/tokens

## 5) 다음 단계 추천

1. `fetchRealContributions()`로 가져온 데이터를 **연도 범위 지정**(GraphQL 변수로 from/to)하기
2. **busiest day / streak 계산 정확도**를 GitHub 기준과 일치시키기
3. 3D 차트를 더 “GitHub 3D” 느낌으로 만들기
   - 바 base plane, ambient shadow, occlusion, hover highlight 개선

## 6) 배포

이 프로젝트 환경에서는 **Publish 탭**에서 배포하세요.

- GitHub: https://github.com/jvisualschool/
- Website: https://www.jvisualschool.com/
