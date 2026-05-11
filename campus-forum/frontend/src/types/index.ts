export interface UserVO {
  id: number;
  username: string;
  nickname: string;
  avatar: string;
  bio: string;
  college: string;
  major: string;
  studentId: string;
  email: string;
  role: number;
  status: number;
  articleCount: number;
  followerCount: number;
  followingCount: number;
  createTime: string;
}

export interface ArticleVO {
  id: number;
  userId: number;
  authorName: string;
  authorAvatar: string;
  categoryId: number;
  categoryName: string;
  title: string;
  summary: string;
  coverImage: string;
  content: string;
  source: number;
  sourceUrl: string;
  status: number;
  toppingStat: number;
  recommendStat: number;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  collectCount: number;
  liked: boolean;
  collected: boolean;
  tags: TagVO[];
  createTime: string;
  updateTime: string;
}

export interface TagVO {
  id: number;
  name: string;
  categoryId: number;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
  sort: number;
  status: number;
}

export interface CommentVO {
  id: number;
  articleId: number;
  userId: number;
  userName: string;
  userAvatar: string;
  content: string;
  parentId: number;
  replyUserId: number;
  replyUserName: string;
  likeCount: number;
  liked: boolean;
  children: CommentVO[];
  createTime: string;
}

export interface NotificationVO {
  id: number;
  fromUserId: number;
  fromUserName: string;
  fromUserAvatar: string;
  type: number;
  targetId: number;
  content: string;
  isRead: number;
  createTime: string;
}

export interface DashboardVO {
  totalUsers: number;
  totalArticles: number;
  totalComments: number;
  todayNewUsers: number;
  todayNewArticles: number;
  categoryArticleCount: Record<string, number>;
}

export interface PageResult<T> {
  total: number;
  page: number;
  size: number;
  pages: number;
  list: T[];
}

export interface Result<T> {
  code: number;
  message: string;
  data: T;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}
