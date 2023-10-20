import {
  eventProps,
  isBot,
  createWhatMonsterKnowsArray,
  logMessageCreation,
  fetchOrCreateMonster,
  notifyTypingToAuthor,
  fetchRecentMessages,
  handleOpenAIInteractions,
  handleError,
} from './utils/messageCreateUtils';
import { BLOCKED_CHANNELS } from '../global';

export default async (event: eventProps) => {
  if (isBot(event) || BLOCKED_CHANNELS.includes(event.channel.id)) return;

  logMessageCreation(event.author.id);

  let monster = await fetchOrCreateMonster(event.author);
  if (!monster) return;

  notifyTypingToAuthor(event.author);

  const messages = await fetchRecentMessages(event.channel);
  const knowledge = createWhatMonsterKnowsArray(monster);

  try {
    handleOpenAIInteractions(event, messages, knowledge, monster);
  } catch (e) {
    handleError(e, event);
  }
};
