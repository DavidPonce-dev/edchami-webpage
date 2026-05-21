export interface Project {
  name: string;
  link: string;
  image: string;
  description: string;
  status: 'pending' | 'onDevelopment' | 'finished';
}

export interface Skill {
  name: string;
  image: string;
}
