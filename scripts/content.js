function createDivStatus(color) {
    const divStatus = document.createElement('div')
    divStatus.setAttribute('id', 'status')
    document.querySelector("#dvSubHeader > div.dt-sub-cont > div:nth-child(3) > div.dt-channel.tac.mt4").append(divStatus)
    divStatus.style.borderRadius = '50%'
    divStatus.style.width = '15px'
    divStatus.style.height = '15px'
    divStatus.style.background = color
}

function createButton() {
    const button = document.createElement('button')
    button.setAttribute('id', 'sendEmailCall')
    document.querySelector("#statusVal").append(button)
    button.innerText = 'E-mail, telefone só chama.'
    button.style.backgroundColor = '#4CAF50'
    button.style.color = 'white'
    button.style.textAlign = 'center'
    button.style.padding = '19px 33px'
    button.style.fontSize = '16px'
    button.style.cursor = 'pointer'
    button.style.height = '53px'
}


async function verifyEmailSend() {
    if (!document.querySelector("#showAllThreads  .pl63")) return false
    var coments = [...document.querySelectorAll("#showAllThreads  .pl63")]
    espereResolver = coments.map(async (element, index) => {
        return await new Promise(resolve => {
            setTimeout(() => {
                element.querySelector('div > h1 > div i') ? resolve(element.querySelector('div > h1 > div i').getAttribute('title')) : resolve()
            }, index * 200)
        })
    })
    resp = await Promise.all(espereResolver)
    if (resp.find(element => element == 'Enviado ( e-mail )')) {
        return true
    } else {
        return false
    }
}

async function desatribuirChamado() {
    return new Promise(async resolve => {
        document.querySelector("#ticketAssign").click()
        await awaitElementSelector("#smt_agent_teams_div > div.mark_assi")
        document.querySelector("#smt_agent_teams_div > div.mark_assi").click()
        resolve()
    })
}

async function setStatusAguardando() {
    return new Promise(async resolve => {
        document.querySelector("#statusBtnContainer").click()
        await awaitElementSelector("#StatusList > ul > li:nth-child(3)")
        document.querySelector("#StatusList > ul > li:nth-child(3)").click()
        resolve()
    })
}

async function sendEmail(nomeClient, numeroChamado, time, textSoChama) {
    return new Promise(async resolve => {
        var primeiroNome = nomeClient.split(' ')
        await awaitElementSelector("#replyContainer div > iframe")
        if (document.querySelector("#replyContainer div > iframe").contentWindow.document.querySelector("body > div:nth-child(1)")) {
            const texto = `${primeiroNome[0] == '.' || primeiroNome[0] == ',' ? primeiroNome[1] : primeiroNome[0]}, ${time}. \n\n` +
                `Esta é a confirmação de que seu chamado de Nº ${numeroChamado}, foi finalizado pelo setor do suporte e seu caso foi dado como solucionado.\n\n` +

                'Favor não responder a este e-mail.\n\n' +

                `Caso tenha qualquer outra dificuldade na plataforma, basta abrir um novo chamado através do link:\n\n` +

                `https://support.zoho.com/portal/waveatendimento/pt/newticket\n\n` +

                'Att,\n' +
                'Suporte Wave'
            document.querySelector("#replyContainer div > iframe").contentWindow.document.querySelector("body > div:nth-child(1)").innerText = textSoChama || texto
            document.querySelector("#send_option_container > div.dis_tab div").click()
            resolve()
        }
    })
}

async function main() {
    if (!window.location.hash.startsWith('#Cases/dv/')) return
    await awaitElementSelector("#statusContainter > div:nth-child(5) a")
    if (document.querySelector("#qdeptcontianer").innerText != 'Suporte Técnico') return
    document.querySelector('div.qlist.wordbreak.reqread.selqlist.qlistsel').addEventListener('click', main)
    if (document.getElementById('status')) document.getElementById('status').remove()
    if (document.getElementById('sendEmailCall')) document.getElementById('sendEmailCall').remove()
    if (document.querySelector("#statusBtnContainer > div.mt3").innerText == 'Fechado') return createDivStatus('red')
    createDivStatus('green')
    createButton()
    document.querySelector("#statusContainter > div:nth-child(5) div > a").addEventListener('click', async function (event) {
        var nomeClient = document.querySelector("#contact-info > div:nth-child(1) > div:nth-child(1) a").innerText
        var numeroChamado = document.querySelector("#dvSubHeader > div.dt-sub-cont > div:nth-child(3) > div.pl63.mw75per > div > div.mr15 a").innerText
        document.querySelector("#ticketReplyContainer div").click()
        var stamp = new Date();
        var hours = stamp.getHours();

        if (hours >= 18 && hours < 24) {
            time = "boa noite"
        } else if (hours >= 12 && hours < 18) {
            time = "boa tarde"
        } else if (hours >= 0 && hours < 12) {
            time = "bom dia"
        }

        const respEmailSend = await verifyEmailSend()
        if (respEmailSend) {
            const confirmSendEmail = confirm('E-mail já foi enviado! Deseja enviar novamente?')
            if (confirmSendEmail) {
                await sendEmail(nomeClient, numeroChamado, time)
                document.querySelector("#back-navigate > i").click()
            } else {
                document.querySelector("#send-options > div > div.fright.mr2.w100p.pointer span").click()
            }
        } else {
            await sendEmail(nomeClient, numeroChamado, time)
            document.querySelector("#back-navigate > i").click()
        }

    })

    document.getElementById('sendEmailCall').addEventListener('click', async () => {
        var nomeClient = document.querySelector("#contact-info > div:nth-child(1) > div:nth-child(1) a").innerText
        var primeiroNome = nomeClient.split(' ')
        var numeroChamado = document.querySelector("#dvSubHeader > div.dt-sub-cont > div:nth-child(3) > div.pl63.mw75per > div > div.mr15 a").innerText
        //var descricaoChamado = document.querySelector("#dvSubHeader > div.dt-sub-cont > div:nth-child(3) > div.pl63.mw75per > div > div.mr15 div span").innerText
        var numeroTelefone = document.querySelector("#RightPanelQCForm > div:nth-child(2) > div:nth-child(8) > div.rpfrm input").value
        var stamp = new Date();
        var hours = stamp.getHours();

        if (hours >= 18 && hours < 24) {
            time = "boa noite"
        } else if (hours >= 12 && hours < 18) {
            time = "boa tarde"
        } else if (hours >= 0 && hours < 12) {
            time = "bom dia"
        }
        var textSoChama =
            `${primeiroNome[0] == '.' || primeiroNome[0] == ',' ? primeiroNome[1] : primeiroNome[0]}, ${time}.\n\n` +
            `Estamos tentando contato no número informado: ${numeroTelefone}, para atender o ticket de número ${numeroChamado}, porém, só chama.\n\n` +
            `Caso tenha algum número alternativo, favor responder a este e-mail informando.\n\n` +
            `Continuaremos tentando contato no telefone informado.\n\n` +
            `Atenciosamente, Suporte Wave`

        document.querySelector("#ticketReplyContainer div").click()

        var respEmailSend = await verifyEmailSend()
        if (respEmailSend) {
            const confirmSendEmail = confirm('E-mail já enviado! Deseja enviar novamente?')
            if (confirmSendEmail) {
                await Promise.resolve(sendEmail(nomeClient, numeroChamado, time, textSoChama))
                await Promise.resolve(desatribuirChamado())
                await Promise.resolve(setStatusAguardando())

            } else {
                document.querySelector("#send-options > div > div.fright.mr2.w100p.pointer span").click()
            }
        } else {
            await Promise.resolve(sendEmail(nomeClient, numeroChamado, time, textSoChama))
            await Promise.resolve(desatribuirChamado())
            await Promise.resolve(setStatusAguardando())
        }
    })
}

async function iniciar() {
    if (window.location.hash.startsWith('#Cases')) {
        const permissao = await Notification.requestPermission()

        if (permissao == 'denied') {
            const permissao = await Notification.requestPermission()
            throw new Error('Permissão negada')
        }
        await awaitElementSelector('#list_view_Cases')
        newObserver()
    }
    main()
    window.onhashchange = async function (event) {
        main()
        if (window.location.hash.startsWith('#Cases')) {
            const permissao = await Notification.requestPermission()

            if (permissao == 'denied') {
                const permissao = await Notification.requestPermission()
                throw new Error('Permissão negada')
            }
            await awaitElementSelector('#list_view_Cases')
            newObserver()
        }

    }
}

iniciar()

function awaitElementSelector(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector))
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector))
                observer.disconnect()
            }
        })
        observer.observe(document.body, {
            childList: true,
            subtree: true
        })
    })
}

async function createdElement(mutation) {
    if (mutation[0].nextSibling) {
        const notification = new Notification('Novo chamado!', {
            body: 'Chamado criado'
        })
        if(!verifyAssignedTicket()){
            let clickFirstItem = document.querySelector("#list_view_Cases > div:nth-child(1) > div > .fright.w315 > .posrel.listAssign > div > i")
            clickFirstItem.click()
            let firstTicket = document.querySelector('#list_view_Cases > div:nth-child(1)')
            awaitElementSelector('#agentsList')
            firstTicket.querySelector('#agentsList> div').click()
        }
    }
}

function newObserver() {
    const observer = new MutationObserver(createdElement)
    const chamadosList = document.querySelector('#list_view_Cases')
    observer.observe(chamadosList, {
        childList: true
    })
}

function verifyAssignedTicket(){
    const agenteName = document.querySelector("#user_logoutphoto").attributes.title.value
    var tickets = [...document.querySelectorAll("#list_view_Cases > div")]
    const agents = tickets.map(ticket=>{
        let selectorData = ticket.querySelector('.fright.w315 > .posrel.listAssign > div').children[0]
        if(selectorData.attributes.title){
            console.log(selectorData.attributes.title)
            return selectorData.attributes.title.value
        }else{
            if(selectorData.querySelector('img')){
                console.log(selectorData.querySelector('img').attributes.title)
                return selectorData.querySelector('img').attributes.title.value
            }else{
                console.log(selectorData.attributes.orgtitle.value)
                return selectorData.attributes.orgtitle.value
            }
            
        }
    })
    if(agents.includes(agenteName)){
        return true
    }else{
        return false
    }
}