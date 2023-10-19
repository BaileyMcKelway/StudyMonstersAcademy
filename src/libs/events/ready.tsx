import logger from '../logger';

const readyHandler = () => {
  logger.info(`Client is ready and has been initialized`);
};

export default readyHandler;
