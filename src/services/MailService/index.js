import mailjetClient from 'node-mailjet'
import Mails from 'ROOT/model/emails'
import logger from 'ROOT/services/logger'
import _ from 'lodash'

const TEMPLATE = {
    RESET_PASSWORD : {id: 1173246, name:'ResetPasswordToken'}
}

const MAIL_STATUS = {
    SUCCESS : 'success',
    FAILED : 'failed'
}

/**
 * Return all email in database without restriction
 * @returns {Promise<*>}
 */
const getEmails = async () => {
    return await Mails.find().sort({sentAt:-1}).limit(200)
}

/**
 * Send email from template
 * @param templateId
 * @param toEmail
 * @param variables
 * @returns {Promise<void>}
 */
const sendTemplateEmail = async (template,toEmail,variables) => {
    const mailer = mailjetClient.connect(process.env.MAILER_API_PUBLIC_KEY, process.env.MAILER_API_PRIVATE_KEY)

    const mail =  new Mails({
        template:template,
        sentTo:toEmail,
        sentAt:new Date(),
        variables:variables
    })

    try {

        const result = await mailer.post('send', {'version': 'v3.1'})
        .request({
            'Messages':[
                {
                    'To': [
                        {
                            'Email': toEmail,
                            'Name': variables.name ? variables.name : toEmail
                        }
                    ],
                    'TemplateID': template.id,
                    'TemplateLanguage': true,
                    'Variables': {
                        ...variables
                    }
                }
            ]
        })

        mail.status = MAIL_STATUS.SUCCESS
        mail.messageId = _.get(result, 'body.messages[0].To[0].MessageID', null)

    } catch (err) {
        logger.error(err)
        mail.status = MAIL_STATUS.FAILED
    }

    await mail.save()
}
/*
const sendResetPasswordEmail = async (toEmail,name,resetLink) => {
    try {
        const mailer = mailjetClient.connect(process.env.MAILER_API_PUBLIC_KEY, process.env.MAILER_API_PRIVATE_KEY)

        const result = await mailer.post('send', {'version': 'v3.1'})
        .request({
            'Messages':[
                {
                    'From': {
                        'Email': 'support@myapp.lc',
                        'Name': 'MyApp Support'
                    },
                    'To': [
                        {
                            'Email': toEmail,
                            'Name': name
                        }
                    ],
                    'TemplateID': 1173246,
                    'TemplateLanguage': true,
                    'Subject': 'Reset password instructions',
                    'Variables': {
                        'name': name,
                        'resetLink': resetLink
                    }
                }
            ]
        })
        console.log(result)
        return true   
    } catch (error) {
        console.log(error)
        return false
    }
}
*/

export default {
    getEmails,
    sendTemplateEmail,
    TEMPLATE
}
//sendResetPasswordEmail,
