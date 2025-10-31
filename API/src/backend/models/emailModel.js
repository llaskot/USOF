import nodemailer from 'nodemailer';
import config from './mailconfig.json' with { type: 'json' };


export class EmailModel {
    __my_mail = config.mail_login
    __my_mail_pass = config.mail_password;

    constructor(user_name, recipient_mail, code) {
        this.user_name = user_name;
        this.recipient_mail = recipient_mail;
        this.code = code;
    }

    mailConfirm() {
        return {
            from: this.__my_mail,
            to: this.recipient_mail,
            subject: "Email confirmation code",
            text: `Dear new user ${this.user_name}!\nUse this code to confirm your email at the registration page \n` +
                'Code:  ' + this.code + " \nDon't share this code!"
        }
    };

    passwordConfirm() {
        return {
            from: this.__my_mail,
            to: this.recipient_mail,
            subject: "Restore password confirmation code",
            text: `Dear user!\nUse this code to confirm your new password at the password restore page \n` +
                'Code:  ' + this.code + " \nDon't share this code!"
        }
    };

    async __send(mailOptions) {
        const transporter = nodemailer.createTransport({
            host: 'smtp.ukr.net',
            port: 465,
            secure: true,
            auth: {
                user: this.__my_mail,
                pass: this.__my_mail_pass
            }
        });

        await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                // return console.error(error);
                console.error(error);
            }
        });
    }

    async sendEmailConfirm() {
        await this.__send(this.mailConfirm())
    }

    async sendPassConfirm() {
        await this.__send(this.passwordConfirm())
    }
}

