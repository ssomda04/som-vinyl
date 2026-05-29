# Som Vinyl

개인 LP 컬렉션을 감성적인 인터페이스로 정리하고 감상할 수 있는 바이닐 아카이브 웹앱입니다.
실제 LP 수납장과 턴테이블 경험에서 영감을 받아 제작했습니다.

## Features

* LP Shelf UI

  * 실제 레코드 수납장처럼 앨범 커버 진열
  * 앨범 클릭 시 상세 Side Panel 표시

* Search & Sort

  * 제목 / 아티스트 / 장르 검색
  * Shelf / Artist / Title / Year 기준 정렬

* Turntable UI

  * 선택한 앨범을 턴테이블에 올려두는 Now Playing 기능
  * LP 디스크 회전 애니메이션
  * LP 반사 효과 및 톤암 UI 구현

* Drag & Drop Shelf

  * 관리자 모드에서 LP 배치 순서 직접 변경
  * shelfOrder 기반 저장

* Admin Mode

  * 비밀번호 기반 관리자 모드
  * LP 추가 / 수정 / 삭제
  * 메모(큐레이션 코멘트) 작성 가능

* Discogs Integration

  * Discogs API 기반 앨범 검색
  * 트랙리스트 / 커버 / 메타데이터 자동 입력

* Supabase Backend

  * 앨범 데이터 저장
  * 메모 / 순서 / 수정사항 영구 저장
  * API Route 기반 write 보호

---

## Tech Stack

* Next.js 16
* TypeScript
* Tailwind CSS
* Supabase
* Discogs API
* dnd-kit

---

## Screenshots

추후 추가 예정

---

## Project Structure

```bash
src
 ├─ app
 │   ├─ api
 │   │   ├─ admin
 │   │   └─ discogs
 │   └─ page.tsx
 │
 ├─ components
 │   ├─ VinylShelf
 │   ├─ AlbumDetailPanel
 │   ├─ TurntableCard
 │   ├─ AddAlbumForm
 │   └─ SearchSortBar
 │
 ├─ lib
 │   ├─ supabase.ts
 │   ├─ supabaseAdmin.ts
 │   └─ albumMapper.ts
 │
 ├─ data
 │   └─ albums.ts
 │
 └─ types
```

---

## Environment Variables

`.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_PASSWORD=
DISCOGS_TOKEN=
```

---

## Local Development

```bash
npm install
npm run dev
```

---

## Deployment

Vercel 배포 기준:

1. GitHub 연결
2. Environment Variables 설정
3. Deploy

---

## Inspiration

LP를 단순히 “음악 데이터”가 아니라
수집과 감상의 경험 자체로 기록하고 싶다는 생각에서 시작한 프로젝트입니다.

실제 턴테이블과 LP 수납장의 감성을 웹 UI로 옮기는 것을 목표로 했습니다.
