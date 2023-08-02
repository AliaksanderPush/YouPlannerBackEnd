import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, ServiceUnavailableException } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendUserCode(
    email: string,
    code: number,
    subject = 'Restore your password',
  ) {
    const confirmation_code = code;

    await this.mailerService
      .sendMail({
        to: email,
        subject: subject,
        template: './notification',
        context: {
          confirmation_code,
        },
      })
      .catch((err) => {
        throw new ServiceUnavailableException({
          description: 'Mailer Service is unavailable',
          cause: err,
        });
      });
  }
}
