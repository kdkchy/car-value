import { 
    Controller, 
    Get, 
    Patch, 
    Param, 
    Query, 
    Post, 
    Body, 
    Delete, 
    Session,
    NotFoundException,
    UseGuards
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto'
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/curent-user.decorator';
import { User } from './user.entity'
import { AuthGuard } from '../guard/auth.guard'

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
    constructor(
        private userService: UsersService,
        private authService: AuthService
    ){}

    @Get('/colors/:color')
    setColor(@Param('color') color: string, @Session() session: any){
        session.color = color;
        return session.color;
    }

    @Get('/colors')
    getColor(@Session() session: any){
        return session.color;
    }

    // @Get('/whoami')
    // whoAmI(@Session() session: any){
    //     return this.userService.findOne(session.userId)
    // }
    
    @Get('/whoami')
    @UseGuards(AuthGuard)
    whoAmI(@CurrentUser() user: User){
        return user;
    }

    @Post('signout')
    signOut(@Session() session: any){
        session.userId = null;
    }

    @Post('/signup')
    async createUser(@Body() body: CreateUserDto, @Session() session: any){
        const user =  await this.authService.signup(body.email, body.password);
        session.userId = user.id;
        return user;
    }

    @Post('/signin')
    async signin(@Body() body: CreateUserDto, @Session() session: any){
        const user = await this.authService.signin(body.email, body.password)
        session.userId = user.id;
        return user;
    }

    // @UseInterceptors(new SerializeInterceptor(UserDto))    
    @Get('/:id')
    async findUser(@Param('id') id: string){
        // console.log('handler is running')
        const user = await this.userService.findOne(parseInt(id));
        if(!user) {
            throw new NotFoundException('user not found');
        }
        return user;
    }

    @Get()
    findAllUsers(@Query('email') email: string){
        return this.userService.find(email)
    }

    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() body: UpdateUserDto){
        return this.userService.update(parseInt(id), body);
    }

    @Delete('/:id')
    removueUser(@Param('id') id: string){
        return this.userService.remove(parseInt(id));

    }
}
