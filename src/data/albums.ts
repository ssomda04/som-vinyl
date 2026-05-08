import { Album } from "@/types/album";

export const albums: Album[] = [
  {
    id: 1,
    title: "Abbey Road",
    artist: "The Beatles",
    year: 1969,
    genre: ["Rock"],
    coverImage: "/covers/abbey-road.jpg",
    tracks: {
      sideA: ["Come Together", "Something", "Maxwell's Silver Hammer"],
      sideB: ["Here Comes the Sun", "Because", "The End"],
    },
    memo: "처음 넣어보는 예시 LP",
  },
  {
    id: 2,
    title: "Blue",
    artist: "Joni Mitchell",
    year: 1971,
    genre: ["Folk"],
    coverImage: "/covers/blue.jpg",
    tracks: {
      sideA: ["All I Want", "My Old Man", "Little Green"],
      sideB: ["California", "River", "The Last Time I Saw Richard"],
    },
    memo: "수납장 느낌 확인용 더미 데이터",
  },
];