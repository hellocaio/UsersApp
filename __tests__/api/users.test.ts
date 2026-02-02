import { fetchUsers } from '../../src/api/users';

describe('Users API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch users successfully', async () => {
    const mockResponse = {
      total: 2,
      page: 1,
      count: 2,
      numPages: 1,
      entries: [
        {
          id: 1,
          name: { firstName: 'John', lastName: 'Doe' },
          email: 'john@example.com',
          gender: 'Male',
          role: 'Admin',
        },
        {
          id: 2,
          name: { firstName: 'Jane', lastName: 'Smith' },
          email: 'jane@example.com',
          gender: 'Female',
          role: 'User',
        },
      ],
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await fetchUsers();

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('my.api.mockaroo.com/users.json')
    );
    expect(result.entries).toHaveLength(2);
    expect(result.entries[0].name.firstName).toBe('John');
  });

  it('should throw error on failed request', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    await expect(fetchUsers()).rejects.toThrow('Failed to fetch users: 500');
  });

  it('should include page parameter in request', async () => {
    const mockResponse = { total: 0, page: 2, count: 0, numPages: 1, entries: [] };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    await fetchUsers(2);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('page=2')
    );
  });
});
