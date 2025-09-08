import { UserResolver } from './users.resolver.js';
import { LoginResolver } from './login.resolver.js';
import { TagResolver } from './tag.resolver.js';
import { ArticleResolver } from './article.resolver.js';

export const resolvers = [
  UserResolver,
  LoginResolver,
  TagResolver,
  ArticleResolver
] as const;