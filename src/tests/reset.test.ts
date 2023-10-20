import { resetMonster } from '../libs/database/utils';

jest.mock('../libs/database/utils', () => ({
  resetMonster: jest.fn(),
}));

import reset from '../libs/interactions/commands/reset';

describe('reset command', () => {
  it('should reset the monster when the correct phrase is provided', async () => {
    const mockInteraction = {
      options: {
        getString: jest.fn().mockReturnValue('RESET MY MONSTER'),
      },
      reply: jest.fn(),
      user: { id: '123' },
    };

    await reset.execute(mockInteraction);

    expect(resetMonster).toHaveBeenCalledWith({ user: mockInteraction.user });
    expect(mockInteraction.reply).toHaveBeenCalledWith(
      'Resetting your monster...'
    );
  });
});
