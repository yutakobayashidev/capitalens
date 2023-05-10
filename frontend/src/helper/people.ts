export function getCommitteeUrl(committeeName: string) {
  switch (committeeName) {
    case "内閣委員会":
      return "https://www.shugiin.go.jp/internet/itdb_iinkai.nsf/html/iinkai/iin_j0010.htm";
    case "総務委員会":
      return "https://www.shugiin.go.jp/internet/itdb_iinkai.nsf/html/iinkai/iin_j0020.htm";
    case "法務委員会":
      return "https://www.shugiin.go.jp/internet/itdb_iinkai.nsf/html/iinkai/iin_j0030.htm";
    case "外務委員会":
      return "https://www.shugiin.go.jp/internet/itdb_iinkai.nsf/html/iinkai/iin_j0040.htm";
    case "財務金融委員会":
      return "https://www.shugiin.go.jp/internet/itdb_iinkai.nsf/html/iinkai/iin_j0050.htm";
    case "文部科学委員会":
      return "https://www.shugiin.go.jp/internet/itdb_iinkai.nsf/html/iinkai/iin_j0060.htm";
    case "厚生労働委員会":
      return "https://www.shugiin.go.jp/internet/itdb_iinkai.nsf/html/iinkai/iin_j0070.htm";
    case "農林水産委員会":
      return "https://www.shugiin.go.jp/internet/itdb_iinkai.nsf/html/iinkai/iin_j0080.htm";
    case "経済産業委員会":
      return "https://www.shugiin.go.jp/internet/itdb_iinkai.nsf/html/iinkai/iin_j0090.htm";
    case "国土交通委員会":
      return "https://www.shugiin.go.jp/internet/itdb_iinkai.nsf/html/iinkai/iin_j0100.htm";
    case "環境委員会":
      return "https://www.shugiin.go.jp/internet/itdb_iinkai.nsf/html/iinkai/iin_j0110.htm";
    case "安全保障委員会":
      return "https://www.shugiin.go.jp/internet/itdb_iinkai.nsf/html/iinkai/iin_j0120.htm";
    case "国家基本政策委員会":
      return "https://www.shugiin.go.jp/internet/itdb_iinkai.nsf/html/iinkai/iin_j0130.htm";
    case "予算委員会":
      return "https://www.shugiin.go.jp/internet/itdb_iinkai.nsf/html/iinkai/iin_j0140.htm";
    case "決算行政監視委員会":
      return "https://www.shugiin.go.jp/internet/itdb_iinkai.nsf/html/iinkai/iin_j0150.htm";
    case "議院運営委員会":
      return "https://www.shugiin.go.jp/internet/itdb_iinkai.nsf/html/iinkai/iin_j0160.htm";
    case "懲罰委員会":
      return "https://www.shugiin.go.jp/internet/itdb_iinkai.nsf/html/iinkai/iin_j0170.htm";
    default:
      return null;
  }
}
