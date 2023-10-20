import essay from '../libs/interactions/commands/essay';

describe('Essay Command', () => {
  const mockFetchNotes = jest.fn();
  jest.mock('../libs/database/utils/getNotes', () => mockFetchNotes());

  it('should check if user did not input enough notes and respond with error message', async () => {
    const interactionMock = {
      deferReply: jest.fn().mockResolvedValue({}),
      editReply: jest.fn().mockResolvedValue({}),
      followUp: jest.fn().mockResolvedValue({}),
      user: {},
      options: {
        getString: jest.fn().mockReturnValue('test'),
      },
    };

    const monsterMock = {
      level: 1,
    };

    await essay.execute(interactionMock, monsterMock);

    expect(interactionMock.editReply).toHaveBeenCalledWith({
      content: 'You did not enter enough notes for me to create an essay!',
    });
  });

  it('should check if database did not return notes and respond with error message', async () => {
    mockFetchNotes.mockReturnValue([]);

    const interactionMock = {
      deferReply: jest.fn().mockResolvedValue({}),
      editReply: jest.fn().mockResolvedValue({}),
      followUp: jest.fn().mockResolvedValue({}),
      user: {},
      options: {
        getString: jest.fn().mockReturnValue('Fruit, Fruit, Seeds'),
      },
    };

    const monsterMock = {
      level: 1,
    };

    await essay.execute(interactionMock, monsterMock);

    expect(interactionMock.editReply).toHaveBeenCalledWith({
      content: 'Hmmm looks like one of the notes is missing',
    });
  });
});
