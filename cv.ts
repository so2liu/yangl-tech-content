import CV from "./cv.types";

const cv: CV = {
  name: {
    CN: "刘扬",
    DE: "Yang Liu",
    EN: "Yang Liu",
  },
  birthYear: 1992,
  email: "so2liu@gmail.com",
  location: { CN: "中国 上海" },
  github: {
    username: "so2liu",
    displayCalendar: true,
  },
  education: [
    {
      from: 2010,
      to: 2014,
      title: {
        DE: "Bachelorstudium an Harbin Institute of Technology, China",
        EN: "Bachelor in Harbin Institute of Technology, China",
        CN: "本科就读于哈尔滨工业大学",
      },
      description: {
        CN: "测控技术与仪器",
      },
      items: [],
    },
    {
      from: 2015,
      to: 2019,
      title: {
        DE: "Masterstudium an der Universität Stuttgart, Deutschland",
        EN: "Master in the University of Stuttgart, Germany",
        CN: "硕士就读于德国斯图加特大学",
      },
      description: {
        CN: "电子信息技术工程",
      },
      items: [],
    },
  ],
  skills: [
    {
      type: "professional training",
      title: { CN: "React" },
      description: { CN: "熟练使用React全家桶" },
    },
  ],
};

export default cv;
