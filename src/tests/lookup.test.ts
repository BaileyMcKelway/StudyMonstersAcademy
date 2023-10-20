import lookup from '../libs/interactions/commands/lookup';
import { getNotes, getEssays } from '../libs/database/utils';

jest.mock('../libs/database/utils', () => ({
  getNotes: jest.fn(),
  getEssays: jest.fn(),
}));

describe('Discord Bot Command: Lookup', () => {
  let mockInteraction: any;

  beforeEach(() => {
    mockInteraction = {
      deferReply: jest.fn(),
      editReply: jest.fn(),
      options: {
        getString: jest.fn(),
      },
    };
  });

  it('should send the correct stats reply when command type is stats', async () => {
    mockInteraction.options.getString.mockReturnValue('stats');

    const mockMonster = {
      level: 5,
      experience: 50,
    };

    await lookup.execute(mockInteraction, mockMonster);

    expect(mockInteraction.deferReply).toHaveBeenCalledWith({
      ephemeral: true,
    });
    expect(mockInteraction.editReply).toHaveBeenCalledWith({
      content: '',
      embeds: [
        {
          title: 'Stats',
          description: '',
          color: 14588438,
          fields: [
            {
              name: 'Level ⬆️',
              value: mockMonster.level,
            },
            {
              name: 'Experience 📈',
              value: `${mockMonster.experience} / ${
                mockMonster.level * 100 + 100
              }`,
            },
          ],
        },
      ],
    });
  });

  it('should send the correct essays reply when there are multiple essays', async () => {
    mockInteraction.options.getString.mockReturnValue('essays');

    const mockEssays = [
      { title: 'Essay 1' },
      { title: 'Essay 2' },
      { title: 'Essay 3' },
    ];

    (getEssays as jest.Mock).mockResolvedValue(mockEssays);

    await lookup.execute(mockInteraction, {});

    expect(mockInteraction.deferReply).toHaveBeenCalledWith({
      ephemeral: true,
    });
    expect(mockInteraction.editReply).toHaveBeenCalledWith({
      content: '',
      embeds: [
        {
          title: 'Essays',
          color: 14588438,
          fields: [
            {
              name: 'Essay Titles',
              value: '- Essay 1\n- Essay 2\n- Essay 3\n',
            },
          ],
        },
      ],
    });
  });

  it('should send a reply indicating no essays when there are none', async () => {
    mockInteraction.options.getString.mockReturnValue('essays');

    (getEssays as jest.Mock).mockResolvedValue([]);

    await lookup.execute(mockInteraction, {});

    expect(mockInteraction.deferReply).toHaveBeenCalledWith({
      ephemeral: true,
    });
    expect(mockInteraction.editReply).toHaveBeenCalledWith({
      content: '',
      embeds: [
        {
          title: 'Essays',
          color: 14588438,
          fields: [{ name: 'No essays', value: '' }],
        },
      ],
    });
  });
  it('should send the correct knowledge reply when monster has knowledge', async () => {
    mockInteraction.options.getString.mockReturnValue('knowledge');

    const mockMonster = {
      knowledge: 'math,science,history',
    };

    await lookup.execute(mockInteraction, mockMonster);

    expect(mockInteraction.deferReply).toHaveBeenCalledWith({
      ephemeral: true,
    });
    expect(mockInteraction.editReply).toHaveBeenCalledWith({
      content: '',
      embeds: [
        {
          title: 'Knowledge',
          color: 14588438,
          fields: [
            {
              name: '3/150',
              value: '',
            },
            {
              name: 'Here are the things I know about:',
              value: 'Math, Science, History',
            },
          ],
        },
      ],
    });
  });

  it('should send a reply indicating no knowledge when monster has none', async () => {
    mockInteraction.options.getString.mockReturnValue('knowledge');

    const mockMonster = {
      knowledge: '',
    };

    await lookup.execute(mockInteraction, mockMonster);

    expect(mockInteraction.deferReply).toHaveBeenCalledWith({
      ephemeral: true,
    });
    expect(mockInteraction.editReply).toHaveBeenCalledWith({
      content: '',
      embeds: [
        {
          title: 'Knowledge',
          color: 14588438,
          fields: [
            {
              name: '0/150',
              value: '',
            },
            {
              name: 'Here are the things I know about:',
              value: '...',
            },
          ],
        },
      ],
    });
  });
});
