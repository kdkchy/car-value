import { IsEmail, IsString, Length} from 'class-validator'
export class CreateUserDto {
    @IsEmail()
    // @Length(5)
    email: string;

    @IsString()
    // @Length(5)
    password: string;
}