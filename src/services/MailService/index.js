//import mailjetClient from 'node-mailjet'
import Mails from 'ROOT/model/Mails'

const TEMPLATE = {
    RESET_PASSWORD : {id: 1173246, name:'ResetPasswordToken'}
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
    //const mailer = mailjetClient.connect(process.env.MAILER_API_PUBLIC_KEY, process.env.MAILER_API_PRIVATE_KEY)

    try {

        const mail =  Mails.create({
            template:template,
            sentTo:toEmail,
            sentAt:new Date(),
            variables:variables
        })

        mail.save()

        /*
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
        console.log(result.body)
        */
    } catch (err) {
        console.log(err.statusCode)
    }
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
