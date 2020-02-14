import FileAsync from 'lowdb/adapters/FileAsync';

type Schema = {
  guildId: {
    memberId: string[];
  };
};

export const adapter = new FileAsync<Schema>('./warnings.json');
