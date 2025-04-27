/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from './schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../email/email.service';
import { ConfigService } from '@nestjs/config';
import {
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

describe('UserService', () => {
  let service: UserService;
  let userModel: jest.Mocked<Model<UserDocument>>;
  let jwtService: JwtService;
  let emailService: EmailService;

  beforeEach(async () => {
    const saveMock = jest.fn();

    const userModelMock = jest.fn().mockImplementation(() => ({
      save: saveMock,
    }));
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken('User'),
          useValue: Object.assign(userModelMock, {
            findOne: jest.fn(),
          }),
        },
        {
          provide: JwtService,
          useValue: { signAsync: jest.fn() },
        },
        {
          provide: EmailService,
          useValue: { sendVerificationEmail: jest.fn() },
        },
        {
          provide: ConfigService,
          useValue: { get: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userModel = module.get(getModelToken('User'));
    jwtService = module.get<JwtService>(JwtService);
    emailService = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    it('should throw ConflictException if email already exists', async () => {
      (userModel.findOne as jest.Mock).mockResolvedValue(true);

      await expect(
        service.signup({
          email: 'test@example.com',
          name: 'Test',
          password: 'Password123!',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should signup and send verification email', async () => {
      (userModel.findOne as jest.Mock).mockResolvedValue(null);

      const signupDto = {
        email: 'test@example.com',
        name: 'Test',
        password: 'Password123!',
      };

      await service.signup(signupDto);

      expect(
        emailService.sendVerificationEmail as jest.Mock,
      ).toHaveBeenCalled();
      expect(userModel).toHaveBeenCalled();
    });
  });

  describe('verifyEmail', () => {
    it('should throw BadRequestException if token invalid', async () => {
      (userModel.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.verifyEmail('invalid-token')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should verify user email', async () => {
      const saveMock = jest.fn();
      (userModel.findOne as jest.Mock).mockResolvedValue({
        isEmailVerified: false,
        emailVerificationToken: 'token',
        save: saveMock,
      });

      const result = await service.verifyEmail('token');

      expect(result).toEqual({ message: 'Email successfully verified!' });
      expect(saveMock).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException if user not found', async () => {
      (userModel.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        service.login('email@example.com', 'password'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if email not verified', async () => {
      (userModel.findOne as jest.Mock).mockResolvedValue({
        isEmailVerified: false,
      });

      await expect(
        service.login('email@example.com', 'password'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password invalid', async () => {
      (userModel.findOne as jest.Mock).mockResolvedValue({
        isEmailVerified: true,
        password: await bcrypt.hash('correctPassword', 10),
      });

      await expect(
        service.login('email@example.com', 'wrongPassword'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should login and return token', async () => {
      const hashedPassword = await bcrypt.hash('Password123!', 10);

      (userModel.findOne as jest.Mock).mockResolvedValue({
        _id: 'userId123',
        email: 'test@example.com',
        password: hashedPassword,
        isEmailVerified: true,
      });

      (jwtService.signAsync as jest.Mock).mockResolvedValue('mock-jwt-token');

      const result = await service.login('test@example.com', 'Password123!');

      expect(result).toEqual({ token: 'mock-jwt-token' });
      expect(jwtService.signAsync as jest.Mock).toHaveBeenCalledWith({
        sub: 'userId123',
        email: 'test@example.com',
      });
    });
  });

  describe('findById', () => {
    it('should call userModel.findOne with correct _id', async () => {
      const user = { _id: 'userId' } as UserDocument;
      await service.findById(user);
      expect(userModel.findOne as jest.Mock).toHaveBeenCalledWith({
        _id: user._id,
      });
    });
  });
});
