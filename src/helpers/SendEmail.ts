import path from 'path';
import handlebars from 'handlebars';
import { readHTMLFile } from 'helpers/File';
import EmailProvider from 'config/email';
import ResponseError from 'modules/Response/ResponseError';
import { BASE_URL_CLIENT } from 'config/baseURL';
import { EmailAttributes, UserAttributes, PasswordResetEmailTemplateAttributes } from 'types/lottery';

const { APP_NAME } = process.env;

class SendMail {
  /**
   *
   * @param formData
   * @param token
   */
  public static AccountRegister(formData: UserAttributes, token: string) {
    const { email, name, lname }: EmailAttributes = formData;
    const pathTemplate = path.resolve(
      __dirname,
      `../../public/templates/emails/register.html`
    );

    const subject = 'Email Verification';
    const urlToken = `${BASE_URL_CLIENT}/email/verify?token=${token}`;
    const dataTemplate = { APP_NAME, name, lname, urlToken };
    const Email = new EmailProvider();

    readHTMLFile(pathTemplate, (error: Error, html: any) => {
      if (error) {
        throw new ResponseError.NotFound('email template not found');
      }

      const template = handlebars.compile(html);
      const htmlToSend = template(dataTemplate);

      Email.send(email, subject, htmlToSend);
    })
  }

  /**
   * 
   */
  public static ResetPassword(formData: PasswordResetEmailTemplateAttributes, token: string) {
    const { email, name, lname } = formData;
    const pathTemplate = path.resolve(
      __dirname,
      `../../public/templates/emails/reset_password.html`
    );

    const subject = 'Reset Password';
    const resetUrl = `${BASE_URL_CLIENT}/site/reset-password?token=${token}`;
    const dataTemplate = { APP_NAME, name, lname, resetUrl };
    const Email = new EmailProvider();

    readHTMLFile(pathTemplate, (error: Error, html: any) => {
      if (error) {
        throw new ResponseError.NotFound('email template not found');
      }

      const template = handlebars.compile(html);
      const htmlToSend = template(dataTemplate);

      Email.send(email, subject, htmlToSend);
    })
  }
}

export default SendMail;
