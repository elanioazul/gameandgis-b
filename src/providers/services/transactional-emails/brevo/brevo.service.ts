import { Injectable } from '@nestjs/common';
import * as brevo from '@getbrevo/brevo';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class BrevoService {
  private apiInstance: brevo.TransactionalEmailsApi;
  constructor() {
    const apiKey = process.env.BRAVO_API_KEY;
    if (!apiKey) {
      throw new Error('BRAVO_API_KEY environment variable is not set');
    }
    this.apiInstance = new brevo.TransactionalEmailsApi();
    this.apiInstance.setApiKey(
      brevo.TransactionalEmailsApiApiKeys.apiKey,
      apiKey,
    );
  }

  async notifyUserRequestIsPending(user: User, admin: User) {
    try {
      const sendSmtpEmail = new brevo.SendSmtpEmail();

      sendSmtpEmail.subject = 'gameandgis-b: Your role upgrade is pending';
      sendSmtpEmail.to = [{ email: user.email, name: user.name }];
      sendSmtpEmail.htmlContent = `<html><body><h1>Hi ${user.name}</h1><p>Your role request is now being process by Admin(${admin.name})</p></body></html>`;
      sendSmtpEmail.sender = {
        name: admin.name,
        email: admin.email,
      };

      const result = await this.apiInstance.sendTransacEmail(sendSmtpEmail);

      console.log(result);
    } catch (err) {
      console.error(err);
    }
  }
  async notifyUserRequestIsApproved(user: User, admin: User) {
    try {
      const sendSmtpEmail = new brevo.SendSmtpEmail();

      sendSmtpEmail.subject = 'gameandgis-b: Your role upgrade was approved';
      sendSmtpEmail.to = [{ email: user.email, name: user.name }];
      sendSmtpEmail.htmlContent = `<html><body><h1>Hi ${user.name}</h1><p>Your role request it has been now approved by Admin(${admin.name})</p></body></html>`;
      sendSmtpEmail.sender = {
        name: admin.name,
        email: admin.email,
      };

      const result = await this.apiInstance.sendTransacEmail(sendSmtpEmail);

      console.log(result);
    } catch (err) {
      console.error(err);
    }
  }
  async notifyAdminNewRoleRequest(admin: User) {
    try {
      const sendSmtpEmail = new brevo.SendSmtpEmail();

      sendSmtpEmail.subject = 'gisandgame-b: New role request pending';
      sendSmtpEmail.to = [{ email: admin.email, name: admin.name }];
      sendSmtpEmail.htmlContent = `<html><body><h1>Hi ${admin.name}</h1><p>There is one role request waiting for approval</p></body></html>`;
      sendSmtpEmail.sender = {
        name: 'Hugo',
        email: 'hugo2023dev@gmail.com',
      };

      const result = await this.apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log('result sending through bravo:' + result);
      console.log(result);
    } catch (err) {
      console.log('error happened sending through bravo');
      console.error(err);
    }
  }
  async notifyUserSignUpSucceded(user: User, admin: User) {
    try {
      const sendSmtpEmail = new brevo.SendSmtpEmail();

      sendSmtpEmail.subject =
        'gameandgis-b: Signup process happened successfully';
      sendSmtpEmail.to = [{ email: user.email, name: user.name }];
      sendSmtpEmail.htmlContent = `
      <html>
        <body>
          <h1>Hi ${user.name}</h1>
          <p>Your request to be a GameandGis user succeded. Login now clicking at the following link so start using GameandGis.</p>
          <a href="http://localhost:4200/#/signin" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: white; background-color: #007BFF; text-align: center; text-decoration: none; border-radius: 5px;">Login Now</a>
        </body>
      </html>`;
      sendSmtpEmail.sender = {
        name: admin.name,
        email: admin.email,
      };

      const result = await this.apiInstance.sendTransacEmail(sendSmtpEmail);

      //console.log(result);
    } catch (err) {
      console.error(err);
    }
  }
}
