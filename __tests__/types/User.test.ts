import { User, UsersResponse } from '../../src/types/User';

describe('User Types', () => {
  it('should correctly type a User object', () => {
    const user: User = {
      id: 1,
      name: {
        firstName: 'John',
        lastName: 'Doe',
      },
      email: 'john@example.com',
      gender: 'Male',
      role: 'Admin',
    };

    expect(user.id).toBe(1);
    expect(user.name.firstName).toBe('John');
    expect(user.name.lastName).toBe('Doe');
    expect(user.email).toBe('john@example.com');
    expect(user.gender).toBe('Male');
    expect(user.role).toBe('Admin');
  });

  it('should correctly type a UsersResponse object', () => {
    const response: UsersResponse = {
      total: 100,
      page: 1,
      count: 10,
      numPages: 10,
      entries: [
        {
          id: 1,
          name: { firstName: 'Test', lastName: 'User' },
          email: 'test@example.com',
          gender: 'Other',
          role: 'Tester',
        },
      ],
    };

    expect(response.total).toBe(100);
    expect(response.page).toBe(1);
    expect(response.numPages).toBe(10);
    expect(response.entries).toHaveLength(1);
  });
});
