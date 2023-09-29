import pino, { Logger } from "pino";
import dayjs from "dayjs";
import pinoPretty from "pino-pretty";



const log: Logger = pino({
    base: {
        pid: false,
    },
    timestamp: () => `,"time":"${dayjs().format()}"`,
}, pinoPretty({
    singleLine: false, // Если true, вывод будет в одну строку
    messageFormat: " {msg}", // Формат сообщения
}));

export default log;
