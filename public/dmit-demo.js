$(function () {

    // Web messenger integration id
    const integrationId = "64589dfbc4f29b1d211acf80";

    Smooch.init({
        integrationId: integrationId,
        businessName: "Mango Smile",
        businessIconUrl: "https://proapp.ngrok.io/mango-smile-logo.png",
        buttonIconUrl: "https://cdn-icons-png.flaticon.com/512/682/682055.png",
        prechatCapture: {
            enabled: true,
            avatarUrl: "https://proapp.ngrok.io/mango-smile@300.png",
            fields: [
                {
                    "name": "name",
                    "label": "ชื่อ",
                    "type": "text",
                    "placeholder": 'กรุณาระบุชื่อ'
                },
                {
                    type: 'email',
                    name: 'email',
                    label: 'อีเมล',
                    placeholder: 'กรุณาระบุอีเมล',
                },
                {
                    type: 'select',
                    name: 'service-category',
                    label: 'หัวข้อที่ต้องการติดต่อ',
                    placeholder: 'กรุณาเลือกหัวข้อที่ต้องการติดต่อ',
                    options: [
                        {
                            name: 'order-inquiry',
                            label: 'ต้องการสั่งซื้อ/สอบถามโปรโมชั่นกับพนักงาน',
                        },
                        {
                            name: 'website-issue',
                            label: 'ปัญหาเกี่ยวกับการสั่งซื้อสินค้าบนเว็บไซต์',
                        },
                        {
                            name: 'order-status',
                            label: 'ติดตามสถานะการจัดส่ง',
                        }
                    ],
                },
            ]
        },
        customText: {
            prechatCaptureGreetingText: 'Mango Smile สวัสดีค่ะ ยินดีต้อนรับเข้าสู่ช่องทางสำหรับสอบถามหรือสั่งซื้อสินค้า',
            prechatCaptureConfirmationText: 'ขอบคุณสำหรับข้อมูลค่ะ ไม่ทราบว่าวันนี้ต้องการให้เราช่วยเหลืออะไรดีคะ'
        },
        delegate: {
            beforeDisplay(message, data) {
                if (message.metadata?.hidden) {
                    return null;
                }
                return message;
            },
            beforeSend(message, data) {
                return message
            }
        }
    })

    Smooch.on('message:received', function (message, data) {
        console.log(`The user received a message in conversation ${data.conversation.id}: `, message);
        Smooch.open();
    });

    $("button[name='sample-error-btn']").on("click", function () {
        let modal = $(".w3-modal");
        modal.show();
        sendMessage()
    });

    //----------- Sample shopify store -----------//
    let contextPath = window.location.pathname.split('/')[1];

    if (contextPath === 'cart') {
        cartHandler()
    }

    async function cartHandler() {


        // hide shopify checkout button
        let checkoutBtn = $("input[name='checkout']");
        checkoutBtn.hide();

        // add mockup error button
        let cartModal = $(`<div id="id01" class="w3-modal"> <div class="w3-modal-content w3-card-4" style='border-radius: 3px; width: 500px;'> <div class="w3-container w3-padding-24 w3-center"> <span onclick="document.getElementById('id01').style.display='none'" class="w3-button w3-display-topright">&times;</span> <div style='padding-top:20px; text-align: center'> <p style='color: #e34c4c'>ไม่สามารถทำรายการได้ในขณะนี้ กรุณารอสักครู่และทำรายการใหม่อีกครั้ง</p></div></div><footer class="w3-container w3-center" style="padding:10px; border-radius: 0 0 3px 3px; border-top: 1px solid #EBEBEB"> <button type="button" class="w3-button w3-padding-small" onclick="document.getElementById('id01').style.display='none'" style="background-color: #607d8b; color: #FFFFFF; border-radius: 3px">Close</button> </footer> </div></div>`);
        let w3css = $(`<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">`);
        let mockupCheckoutBtn = $('<input type="button" name="checkout" class="cart__submit btn btn--small-wide" value="Sample Errors">');

        // add w3css
        $("body").prepend(w3css);

        mockupCheckoutBtn.on("click", function () {
            let modal = $(".w3-modal");
            modal.show();
            sendMessage()
        });

        checkoutBtn
            .after(mockupCheckoutBtn)
            .after(cartModal);

    }

    function sendMessage() {

        let conversationId
        let conversations = Smooch.getConversations();

        console.log('conversations ->', conversations);

        if (!conversations || conversations.length === 0) {
            // create new conversation
            Smooch.createConversation({
                displayName: "Mango Smile",
                iconUrl: 'https://proapp.ngrok.io/mango-smile@300.png',
                // description: 'Champions of Customer Service',
                messages: [
                    {
                        type: 'text',
                        text: 'Error Code: 9037\nError Message: Merchant configuration is missing\nURL: ' + window.location.href,
                        metadata: {
                            hidden: true,
                            type: 'error_message'
                        }
                    }
                ]

            }).then((conversation) => {
                // Your code after receiving the current user's new conversation
                // Smooch.open();
            });
        } else {
            conversationId = conversations[0].id;
            console.log("conversationId", conversationId);

            Smooch.sendMessage({
                type: 'text',
                text: 'Error Code: 9037\nError Message: Merchant configuration is missing\nURL: ' + window.location.href,
                metadata: {
                    hidden: true,
                    type: 'error_message'
                }
            }, conversationId).then((rs) => {
                console.log('rs', rs);
                // Smooch.open();
            })
        }
    }
})