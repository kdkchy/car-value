import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service'; 
import { User } from './user.entity';

describe('AuthService', () => {
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>;

    beforeEach(async () => {
        //create a fake copy of the user service
        const users: User[] = [];
        fakeUsersService = {
            find: (email: string) => {
                const filteredUsers = users.filter(user => user.email === email);
                return Promise.resolve(filteredUsers);
            },
            create: (email: string, password: string) => {
                const user = {id: Math.floor(Math.random() * 9999), email, password} as User
                users.push(user);
                return Promise.resolve(user);
            }
                
        };
        
        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUsersService
                }
            ]
        }).compile();

        service = module.get(AuthService);
    });

    it('can create and instance of auth service', async () => {
        expect(service).toBeDefined();
    });

    it('create a new user with a salted and hashed password', async () => {
        const user = await service.signup('asd@asd.com', 'asd');

        expect(user.password).not.toEqual('asd');
        const [salt, hash] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    })

    it('throws an error if user signs up with email that is in use', async () => {
        // fakeUsersService.find = () => 
        //     Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);
        await service.signup('asdf@asdf.com', 'asdf');
        await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
            BadRequestException,
        );
    });

    it('throws if signin is called with an unused email', async () => {
        await expect(
            service.signin('asdflkj@asdlfkj.com', 'passdflkj')
        ).rejects.toThrow(NotFoundException);
    });
    
    it('throws if an invalid password is provided', async () => {
        // fakeUsersService.find = () =>
        //     Promise.resolve([
        //         { email: 'asdf@asdf.com', password: 'laskdjfasdasd' } as User
        //     ]);
        await service.signup('asdf@asdf.com', 'password');
        await expect(
            service.signin('asdf@asdf.com', 'laskdjfasdasd'),
        ).rejects.toThrow(BadRequestException);
    });

    it('returns a user if correct password is provide', async () => {
        // fakeUsersService.find = () =>
        //     Promise.resolve([
        //         { email: 'asdf@asdf.com', password: 'bc66d6b8adb560b0.a3f518878cbf7809eb8538aed5b7bb763601a0c6160629404dc444b20018a025' } as User
        //     ]);

        await service.signup('asd@asd.com', 'mypassword');
        const user = await service.signin('asd@asd.com', 'mypassword');
        expect(user).toBeDefined();

        // const user = await service.signup('asd@asd.com', 'mypassword');
        // console.log(user);

    });
});
