import { Global, Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { join } from 'path';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            type: 'OAuth2',
            user: configService.get<string>('GOOGLE_MAIL_USERNAME'),
            pass: configService.get<string>('GOOGLE_MAIL_USERPASSWORD'),
          },
        },
        defaults: {
          from: '"No Reply" <XXXXXXXXXXXXXXXXXX>',
        },
        template: {
          dir: join(__dirname, 'template'),
          adapter: new EjsAdapter(),
          options: {
            strict: false,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],

  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
