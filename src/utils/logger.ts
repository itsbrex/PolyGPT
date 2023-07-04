import { ChatCompletionRequestMessage } from "openai";
import winston from "winston";
const figlet = require("figlet");

const getLogFileName = () => {
  const date = new Date();
  const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}_${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
  return `chats/chat_${formattedDate}.log`;
}

const logger = winston.createLogger({
  format: winston.format.printf(info => `${info.message}`),
  transports: [
    new winston.transports.File({ filename: getLogFileName() }),
  ],
});

export const logToFile = (message: ChatCompletionRequestMessage) => {
  logger.info(`---
  ${message.role}: ${message.content}`);
};

export const logHeader = () => {
  figlet.text('PolyGPT', {
    font: 'Slant',
    horizontalLayout: 'default',
    verticalLayout: 'default',
    whitespaceBreak: true
  }, function(err: Error | null, data?: string) {
    if (err) {
      console.log('Something went wrong...');
      console.dir(err);
      
      return;
    }
    console.log(data);
    console.log(`
    You should now be transfered to the AI agent. If it doesn't load restart the CLI application with Ctrl+C.
    
    Once loaded, ask it to load a wrap and then to execute one of its functions! Welcome to the future!`)
    logger.info(data);
  });
};
