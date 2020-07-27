export default interface CV {
  name: MultiLanguageStr;
  birthYear: number;
  email: string;
  location: MultiLanguageStr;
  github?: {
    username: string;
    displayCalendar: boolean;
  };
  education: LifeRecord[];
  career?: LifeRecord[];
  skills: Skill[];
}

interface MultiLanguageStr {
  CN: string;
  DE?: string;
  EN?: string;
}

interface LifeRecord {
  from: MultiLanguageStr | number;
  to: MultiLanguageStr | number;
  title: MultiLanguageStr;
  description: MultiLanguageStr;
  items: MultiLanguageStr[];
}

interface Skill {
  type: "certificate" | "course" | "professional training";
  title: MultiLanguageStr;
  description: MultiLanguageStr;
}
