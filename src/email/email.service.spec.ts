/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

describe('EmailService', () => {
  let emailService: EmailService;
  let mailerService: MailerService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    emailService = module.get<EmailService>(EmailService);
    mailerService = module.get<MailerService>(MailerService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should send verification email with correct data', async () => {
    const email = 'test@example.com';
    const name = 'Test User';
    const token = 'abc123';

    (configService.get as jest.Mock).mockReturnValue('http://frontend.com');

    await emailService.sendVerificationEmail(email, name, token);

    expect(configService.get).toHaveBeenCalledWith('FRONTEND_URL');
    expect(mailerService.sendMail as jest.Mock).toHaveBeenCalledWith({
      to: email,
      subject: 'Verify Your Email',
      template: './verification',
      context: {
        name,
        verificationLink: 'http://frontend.com/verify-email?token=abc123',
      },
    });
  });
});
