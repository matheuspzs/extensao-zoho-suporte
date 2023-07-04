function createDivStatus(color) {
  const divStatus = document.createElement('div');
  divStatus.id = 'status';
  const targetElement = document.querySelector('#dvSubHeader > div.dt-sub-cont > div:nth-child(3) > div.dt-channel.tac.mt4');
  targetElement.append(divStatus);
  Object.assign(divStatus.style, {
    borderRadius: '50%',
    width: '15px',
    height: '15px',
    background: color
  });
}

function createButton() {
  const button = document.createElement('button');
  button.id = 'sendEmailCall';
  const targetElement = document.querySelector('#statusVal');
  targetElement.append(button);
  Object.assign(button.style, {
    backgroundColor: '#4CAF50',
    color: 'white',
    textAlign: 'center',
    padding: '19px 33px',
    fontSize: '16px',
    cursor: 'pointer',
    height: '53px'
  });
  button.innerText = 'E-mail, telefone só chama.';
}

async function verifyEmailSend() {
  const coments = [...document.querySelectorAll('#showAllThreads .pl63')];
  const espereResolver = coments.map(async (element, index) => {
    return await new Promise(resolve => {
      setTimeout(() => {
        const title = element.querySelector('div > h1 > div i')?.getAttribute('title');
        resolve(title);
      }, index * 200);
    });
  });
  const resp = await Promise.all(espereResolver);
  return resp.some(element => element === 'Enviado ( e-mail )');
}

async function desatribuirChamado() {
  document.querySelector('#ticketAssign').click();
  await awaitElementSelector('#smt_agent_teams_div > div.mark_assi');
  document.querySelector('#smt_agent_teams_div > div.mark_assi').click();
}

async function setStatusAguardando() {
  document.querySelector('#statusBtnContainer').click();
  await awaitElementSelector('#StatusList > ul > li:nth-child(3)');
  document.querySelector('#StatusList > ul > li:nth-child(3)').click();
}

async function sendEmail(nomeClient, numeroChamado, time, textSoChama) {
  await awaitElementSelector('#replyContainer div > iframe');
  const iframe = document.querySelector('#replyContainer div > iframe').contentWindow.document;
  const firstChild = iframe.querySelector('body > div:nth-child(1)');
  if (firstChild) {
    const primeiroNome = nomeClient.split(' ');
    const texto =
      `${primeiroNome[0] == '.' || primeiroNome[0] == ',' ? primeiroNome[1] : primeiroNome[0]}, ${time}. \n\n` +
      `Esta é a confirmação de que seu chamado de Nº ${numeroChamado}, foi finalizado pelo setor do suporte e seu caso foi dado como solucionado.\n\n` +
      'Favor não responder a este e-mail.\n\n' +
      `Caso tenha qualquer outra dificuldade na plataforma, basta abrir um novo chamado através do link:\n\n` +
      `https://support.zoho.com/portal/waveatendimento/pt/newticket\n\n` +
      'Att,\n' +
      'Suporte Wave';
    firstChild.innerText = textSoChama || texto;
    document.querySelector('#send_option_container > div.dis_tab div').click();
  }
}

async function main() {
  if (!window.location.hash.startsWith('#Cases/dv/')) return;
  await awaitElementSelector('#statusVal');
  
  // Verificar se o e-mail foi enviado
  const emailSent = await verifyEmailSend();

  // Criar o status do chamado
  if (emailSent) {
    createDivStatus('green');
  } else {
    createDivStatus('red');
  }

  // Criar o botão de enviar e-mail
  createButton();

  // Obter informações do chamado
  const ticketInfo = getTicketInfo();

  // Capturar eventos do botão
  const sendEmailButton = document.querySelector('#sendEmailCall');
  sendEmailButton.addEventListener('click', async () => {
    const nomeCliente = ticketInfo.clientName;
    const numeroChamado = ticketInfo.ticketNumber;
    const time = ticketInfo.time;
    const textSoChama = ticketInfo.textSoChama;
    await sendEmail(nomeCliente, numeroChamado, time, textSoChama);
  });
}

main();
