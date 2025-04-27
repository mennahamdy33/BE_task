/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { NotFoundException } from '@nestjs/common';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            signup: jest.fn(),
            verifyEmail: jest.fn(),
            login: jest.fn(),
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    userController = moduleRef.get<UserController>(UserController);
    userService = moduleRef.get<UserService>(UserService);
  });

  it('should call signup with correct data', async () => {
    const signupDto: SignupDto = {
      email: 'test@example.com',
      name: 'Test User',
      password: 'Password@123',
    };

    (userService.signup as jest.Mock).mockResolvedValue({
      message: 'Signup successful!',
    });

    const result = await userController.signup(signupDto);

    expect(userService.signup).toHaveBeenCalledWith(signupDto);
    expect(result).toEqual({ message: 'Signup successful!' });
  });

  it('should call verifyEmail with correct token', async () => {
    const token = 'verification-token';
    (userService.verifyEmail as jest.Mock).mockResolvedValue({
      message: 'Email verified',
    });

    const result = await userController.verifyEmail(token);

    expect(userService.verifyEmail).toHaveBeenCalledWith(token);
    expect(result).toEqual({ message: 'Email verified' });
  });

  it('should call login with correct credentials', async () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'Password@123',
    };
    (userService.login as jest.Mock).mockResolvedValue({ token: 'jwt-token' });

    const result = await userController.login(loginDto);

    expect(userService.login).toHaveBeenCalledWith(
      loginDto.email,
      loginDto.password,
    );
    expect(result).toEqual({ token: 'jwt-token' });
  });

  it('should return user profile', async () => {
    const mockUser = { userId: 'userId' };
    const req = { user: mockUser } as any;

    const foundUser = { name: 'Test User', email: 'test@example.com' };
    (userService.findById as jest.Mock).mockResolvedValue(foundUser);

    const result = await userController.getProfile(req);

    expect(userService.findById).toHaveBeenCalledWith(mockUser);
    expect(result).toEqual({ name: 'Test User', email: 'test@example.com' });
  });

  it('should throw NotFoundException if user not found', async () => {
    const mockUser = { userId: 'userId' };
    const req = { user: mockUser } as any;

    (userService.findById as jest.Mock).mockResolvedValue(null);

    await expect(userController.getProfile(req)).rejects.toThrow(
      NotFoundException,
    );
  });
});
