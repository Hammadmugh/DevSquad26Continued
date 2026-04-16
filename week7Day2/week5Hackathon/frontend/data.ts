export const auctionItems = [
  {
    carName: "Mazda MX-5",
    carImage: "/live-auction-1.png",
    currentBid: "$1,079.99",
    timeLeft: "10 : 20 : 47",
    trending: true,
  },
  {
    carName: "Porsche 911",
    carImage: "/live-auction-2.png",
    currentBid: "$1,079.99",
    timeLeft: "10 : 20 : 47",
    trending: true,
  },
  {
    carName: "Alpine A110",
    carImage: "/live-auction-3.png",
    currentBid: "$1,079.99",
    timeLeft: "10 : 20 : 47",
    trending: false,
  },
  {
    carName: "BMW M4",
    carImage: "/live-auction-4.png",
    currentBid: "$1,079.99",
    timeLeft: "10 : 20 : 47",
    trending: true,
  },
];


export const cars = [
  {
    carName: "Range Rover",
    carImage: "/car auction (1).png",
    currentBid: "$1,07899.99",
    totalBids: 130,
    rating: 5,
    review:
      "Lorem ipsum dolor sit amet consectetur. Velit amet aenean sed nunc. Malesuada dignissim viverra praesent aenean nulla mattis....",
    endTime: "06:00pm 03 Jan 2023",
    countdown: { days: 31, hours: 20, mins: 40, secs: 25 },
    trending: true,
  },
  {
    carName: "Kia Carnival",
    carImage: "/car auction (2).png",
    currentBid: "$1,07899.99",
    totalBids: 130,
    rating: 5,
    review:
      "Lorem ipsum dolor sit amet consectetur. Velit amet aenean sed nunc. Malesuada dignissim viverra praesent aenean nulla mattis....",
    endTime: "06:00pm 03 Jan 2023",
    countdown: { days: 31, hours: 20, mins: 40, secs: 25 },
    trending: false,
  },
  {
    carName: "Bently",
    carImage: "/car auction (3).png",
    currentBid: "$1,07899.99",
    totalBids: 130,
    rating: 5,
    review:
      "Lorem ipsum dolor sit amet consectetur. Velit amet aenean sed nunc. Malesuada dignissim viverra praesent aenean nulla mattis....",
    endTime: "06:00pm 03 Jan 2023",
    countdown: { days: 31, hours: 20, mins: 40, secs: 25 },
    trending: false,
  },
  {
    carName: "Hyunai Verna",
    carImage: "/car auction (4).png",
    currentBid: "$1,07899.99",
    totalBids: 130,
    rating: 5,
    review:
      "Lorem ipsum dolor sit amet consectetur. Velit amet aenean sed nunc. Malesuada dignissim viverra praesent aenean nulla mattis....",
    endTime: "06:00pm 03 Jan 2023",
    countdown: { days: 31, hours: 20, mins: 40, secs: 25 },
    trending: true,
  },
  {
    carName: "Mahindra Thar",
    carImage: "/car auction (5).png",
    currentBid: "$1,07899.99",
    totalBids: 130,
    rating: 5,
    review:
      "Lorem ipsum dolor sit amet consectetur. Velit amet aenean sed nunc. Malesuada dignissim viverra praesent aenean nulla mattis....",
    endTime: "06:00pm 03 Jan 2023",
    countdown: { days: 31, hours: 20, mins: 40, secs: 25 },
    trending: false,
  },
  {
    carName: "Ferrari",
    carImage: "/car auction (6).png",
    currentBid: "$1,07899.99",
    totalBids: 130,
    rating: 5,
    review:
      "Lorem ipsum dolor sit amet consectetur. Velit amet aenean sed nunc. Malesuada dignissim viverra praesent aenean nulla mattis....",
    endTime: "06:00pm 03 Jan 2023",
    countdown: { days: 31, hours: 20, mins: 40, secs: 25 },
    trending: true,
  },
  {
    carName: "BMW M4",
    carImage: "/car auction (7).png",
    currentBid: "$1,07899.99",
    totalBids: 130,
    rating: 5,
    review:
      "Lorem ipsum dolor sit amet consectetur. Velit amet aenean sed nunc. Malesuada dignissim viverra praesent aenean nulla mattis....",
    endTime: "06:00pm 03 Jan 2023",
    countdown: { days: 31, hours: 20, mins: 40, secs: 25 },
    trending: false,
  },
  {
    carName: "Maruti Brezza",
    carImage: "/car auction (8).png",
    currentBid: "$1,07899.99",
    totalBids: 130,
    rating: 5,
    review:
      "Lorem ipsum dolor sit amet consectetur. Velit amet aenean sed nunc. Malesuada dignissim viverra praesent aenean nulla mattis....",
    endTime: "06:00pm 03 Jan 2023",
    countdown: { days: 31, hours: 20, mins: 40, secs: 25 },
    trending: false,
  },
  {
    carName: "Jaguar XF",
    carImage: "/car auction (9).png",
    currentBid: "$1,07899.99",
    totalBids: 130,
    rating: 5,
    review:
      "Lorem ipsum dolor sit amet consectetur. Velit amet aenean sed nunc. Malesuada dignissim viverra praesent aenean nulla mattis....",
    endTime: "06:00pm 03 Jan 2023",
    countdown: { days: 31, hours: 20, mins: 40, secs: 25 },
    trending: true,
  },
  {
    carName: "Tata Tiago",
    carImage: "/car auction (10).png",
    currentBid: "$1,07899.99",
    totalBids: 130,
    rating: 5,
    review:
      "Lorem ipsum dolor sit amet consectetur. Velit amet aenean sed nunc. Malesuada dignissim viverra praesent aenean nulla mattis....",
    endTime: "06:00pm 03 Jan 2023",
    countdown: { days: 31, hours: 20, mins: 40, secs: 25 },
    trending: false,
  },
];



export const MY_BIDS = [
  { name: "BMW M4",        image: "/car auction (1).png", winningBid: "$60,000",     yourBid: "$40,000",     bidStatus: "losing"  as const, bids: "130", trending: true,  canBid: true  },
  { name: "Tata Tiago XZ", image: "/car auction (2).png", winningBid: "$60,000",     yourBid: "$60,000",     bidStatus: "winning" as const, bids: "130", trending: false, canBid: false },
  { name: "BMW Z4",        image: "/car auction (3).png", winningBid: "$1,07899.99", yourBid: "$1,07899.99", bidStatus: "losing"  as const, bids: "130", trending: false, canBid: true  },
];

export const WISHLIST = [
  { name: "Tata Nexon",    image: "/car auction (1).png", currentBid: "$1,07899.99", bids: "130", endTime: "06:00pm 03 Jan 2023", trending: true  },
  { name: "BMW Z4",        image: "/car auction (2).png", currentBid: "$1,07899.99", bids: "130", endTime: "06:00pm 03 Jan 2023", trending: true  },
  { name: "Hyundai Verna", image: "/car auction (3).png", currentBid: "$1,07899.99", bids: "130", endTime: "06:00pm 03 Jan 2023", trending: true  },
  { name: "Honda City",    image: "/car auction (4).png", currentBid: "$1,07899.99", bids: "130", endTime: "06:00pm 03 Jan 2023", trending: false },
  { name: "Ferrari",       image: "/car auction (5).png", currentBid: "$1,07899.99", bids: "130", endTime: "06:00pm 03 Jan 2023", trending: true  },
  { name: "BMW M4",        image: "/car auction (6).png", currentBid: "$1,07899.99", bids: "130", endTime: "06:00pm 03 Jan 2023", trending: false },
];

export const MY_CARS = [
  { name: "BMW M4",      image: "/car auction (1).png", bid: "$60,000", bids: "130", trending: true,  sold: false },
  { name: "Tata Tiago XZ", image: "/car auction (2).png", bid: "$60,000", bids: "130", trending: false, sold: true  },
];