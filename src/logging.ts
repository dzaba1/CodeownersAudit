import { Logger, createLogger, transports, format } from "winston";

export module Logging {
    export function createDefaultLogger(): Logger {
        return createLogger({
            format: format.combine(
                format.timestamp(),
                format.colorize(),
                format.splat(),
                format.printf(({ level, message, timestamp }) => {
                    return `${timestamp} ${level} - ${message}`;
                  })
            ),
            transports: [new transports.Console()]
          });
    }
}