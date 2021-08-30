import { Query, Resolver, Ctx } from 'type-graphql';

import { Context } from '../utils/graphqlContext';

@Resolver()
export class UserResolver {
  @Query(() => String)
  async user(@Ctx() ctx: Context): Promise<string> {
    console.log(ctx.dbClient);
    return 'hello world';
  }
}