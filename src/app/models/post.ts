export interface Post {
  title: string;
  permaLink: string;
  categorie: { categorieId: string; categorie: string };
  postImgPath: string;
  excerpt: string;
  content: string;
  isFeatured: boolean;
  views: number;
  status: string;
  cratedAt: Date;
}
