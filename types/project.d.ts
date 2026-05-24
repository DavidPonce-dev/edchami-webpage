export interface Project {
  id: number;
  title: string;
  description: string;
  url: string | null;
  imageUrl: string | null;
  tags: string[];
  status: 'pending' | 'onDevelopment' | 'finished';
  createdAt: Date;
  updatedAt: Date;
}

export interface Skill {
  name: string;
  image: string;
}
