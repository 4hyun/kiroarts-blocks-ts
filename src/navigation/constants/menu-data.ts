export const menuData = [
  [
    ["협회소개", "53"],
    ["인사말", "56"],
    ["연혁", "61"],
    ["조직도", "64"],
    ["찾아오시는 길", "70"],
  ],
  [
    ["협회행사", "44"],
    ["협회전시행사", "50"],
    ["기타행사", "232"],
    ["언론", "244"],
  ],
  [
    ["커뮤니티", "30"],
    ["공지사항", "35"],
    ["중국전시관 안내", "38"],
    ["중국협력기관 및 소개", "41"],
  ],
  [
    ["사이버갤러리", "21"],
    ["협회전시영상", "24"],
    ["협회원 개인전 소개", "27"],
  ],
]

export const menuDataStructured = [
  {
    slug: "협회소개",
    description: "association-introduction",
    items: [
      { label: "인사말", pageId: 56 },
      { label: "연혁", pageId: 61 },
      { label: "조직도", pageId: 64 },
      { label: "찾아오시는 길", pageId: 70 },
    ],
  },
  {
    slug: "협회행사",
    description: "association-events",
    items: [
      { label: "협회전시행사", pageId: 50 },
      { label: "기타행사", pageId: 232 },
      { label: "언론", pageId: 244 },
    ],
  },
  {
    slug: "커뮤니티",
    description: "community",
    items: [
      { label: "공지사항", pageId: 35 },
      { label: "중국전시관 안내", pageId: 38 },
      { label: "중국협력기관 및 소개", pageId: 41 },
    ],
  },
  {
    slug: "사이버갤러리",
    description: "cyber-gallery",
    items: [
      { label: "협회전시영상", pageId: 24 },
      { label: "협회원 개인전 소개", pageId: 27 },
    ],
  },
]
