import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
} from '@nestjs/common';
import { FollowersService } from './followers.service';
import { User } from '../user/entities/user.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Auth } from '../auth/decorators/auth.decorator';

@Controller('followers')
export class FollowersController {
  constructor(private readonly followersService: FollowersService) {}

  @Post(':userId/follow')
  @Auth()
  follow(@Param('userId') userId: string, @CurrentUser() user: User) {
    return this.followersService.follow(userId, user._id.toString());
  }

  @Delete(':userId/unfollow')
  @Auth()
  unfollow(@Param('userId') userId: string, @CurrentUser() user: User) {
    return this.followersService.unfollow(userId, user._id.toString());
  }

  @Get(':userId/followers')
  getFollowers(@Param('userId') userId: string) {
    return this.followersService.getFollowers(userId);
  }

  @Get(':userId/following')
  getFollowing(@Param('userId') userId: string) {
    return this.followersService.getFollowing(userId);
  }

  @Get(':userId/is-following/:targetId')
  @Auth()
  isFollowing(
    @Param('userId') userId: string,
    @Param('targetId') targetId: string,
  ) {
    return this.followersService.isFollowing(userId, targetId);
  }
}
