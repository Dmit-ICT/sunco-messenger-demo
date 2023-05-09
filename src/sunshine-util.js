import * as SunshineConversationsApi from "sunshine-conversations-client";
import * as dotenv from 'dotenv';
dotenv.config();

const defaultClient = SunshineConversationsApi.ApiClient.instance;
const { APP_ID: appId, INTEGRATION_ID: integrationId, KEY_ID, SECRET, SERVICE_URL } = process.env;

const basicAuth = defaultClient.authentications["basicAuth"];
basicAuth.username = KEY_ID;
basicAuth.password = SECRET;

export const passControl = async (req, res) => {

    const conversationId = req.body.events[0].payload.conversation.id;
    const payload = req.body.events[0].payload;
    let item, name, email, serviceCategory

    try {

        if (payload.message?.content?.type === 'formResponse') {

            for (let idx in payload.message.content.fields) {

                item = payload.message.content.fields[idx]

                if (item.name === 'name') {
                    name = item.text;
                } else if (item.name === 'email') {
                    email = item.email;
                } else if (item.name === 'service-category') {
                    if (item.select?.length > 0) {
                        serviceCategory = item.select[0].name
                    }
                }
            }
        }

        const switchboardActionsApi = new SunshineConversationsApi.SwitchboardActionsApi()
        let passControlBody = new SunshineConversationsApi.PassControlBody();
        passControlBody.switchboardIntegration = 'next'

        // switchboard metadata sending to Zendesk
        passControlBody.metadata = {
            "dataCapture.systemField.requester.name": name,
            "dataCapture.systemField.requester.email": email
        }

        passControlBody.metadata[`dataCapture.ticketField.${process.env.SERVICE_CATEGORY_FIELD}`] = serviceCategory
        passControlBody.metadata[`dataCapture.ticketField.${process.env.SHOP_FIELD}`] = "Mango Smile"

        console.log("metadata\n", JSON.stringify(passControlBody.metadata, null, 4));

        switchboardActionsApi.passControl(appId, conversationId, passControlBody).then(function (data) {
            console.log('API called successfully. Returned data: ' + data);
        }, function (error) {
            console.error(error);
        });

        res.status(200).send({ success: true });

    } catch (err) {
        console.log(err)
        res.status(500).send(err.message);
    }
}

export const sendMessage = async (req, message) => {

    const conversationId = req.body.events[0].payload.conversation.id;
    const messagesApiInstance = new SunshineConversationsApi.MessagesApi();

    try {

        let messagePost = new SunshineConversationsApi.MessagePost();
        messagePost.setAuthor({ type: "business" });
        messagePost.setContent({
            type: "text",
            text: message,
        });
        await messagesApiInstance.postMessage(appId, conversationId, messagePost);

    } catch (err) {
        console.log(err)
    }

}