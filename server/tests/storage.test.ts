import { MemStorage } from '../storage';
import type { InsertUser } from '../../shared/schema';

describe('MemStorage', () => {
  let storage: MemStorage;

  beforeEach(() => {
    storage = new MemStorage(); // reinicia almacenamiento en cada test
  });

  it('createUser debe crear un nuevo usuario con ID incremental', async () => {
    const input: InsertUser = {
      username: 'laura',
      password: '123456',
    };

    const user = await storage.createUser(input);

    expect(user.id).toBe(1);
    expect(user.username).toBe('laura');
    // expect(user.email).toBe('laura@example.com'); // Eliminado porque no existe
  });

  it('getUser debe retornar un usuario por ID', async () => {
    const input: InsertUser = {
      username: 'cristian',
      password: 'pass123',
    };

    const created = await storage.createUser(input);
    const fetched = await storage.getUser(created.id);

    expect(fetched).toEqual(created);
  });

  it('getUserByUsername debe retornar el usuario correcto por username', async () => {
    const input1: InsertUser = {
      username: 'gustavo',
      password: 'guspass',
    };

    const input2: InsertUser = {
      username: 'camilo',
      password: 'camipass',
    };

    await storage.createUser(input1);
    const user2 = await storage.createUser(input2);

    const found = await storage.getUserByUsername('camilo');

    expect(found).toEqual(user2);
  });

  it('getUser debe retornar undefined si no existe el usuario', async () => {
    const user = await storage.getUser(999);
    expect(user).toBeUndefined();
  });

  it('getUserByUsername debe retornar undefined si el usuario no existe', async () => {
    const user = await storage.getUserByUsername('desconocido');
    expect(user).toBeUndefined();
  });
});
