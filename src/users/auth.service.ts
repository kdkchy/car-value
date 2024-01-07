import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _script } from "crypto";
import { promisify } from "util";

const scrypt = promisify(_script);


@Injectable()
export class AuthService {
    constructor(private userService: UsersService){}

    async signup(email: string, password: string){
        // see if email is in use
        const users = await this.userService.find(email);
        if(users.length){
            throw new BadRequestException('email in use');
        }

        // hash the users password
        // genrate hash
        const salt = randomBytes(8).toString('hex');

        //hash the salt and the password together
        const hash = (await scrypt(password, salt, 32)) as Buffer;

        //join the hashed result and the salt together
        const result = salt + '.' + hash.toString('hex');

        // create a new user and save it
        const user = await this.userService.create(email, result);

        // return the user 
        return user

    }

    async signin(email: string, password: string){
        const [user] = await this.userService.find(email)
        if(!user){
            throw new NotFoundException('user not found');
        }

        const [salt, storedHas] = user.password.split('.');

        const hash = (await scrypt(password, salt, 32)) as Buffer;

        if(storedHas !== hash.toString('hex')){
            throw new BadRequestException('bad password');
        }

        return user;
    }
}