import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import HomeView from '@/views/HomeView.vue';
import { createPinia, setActivePinia } from 'pinia';


vi.mock('@/stores/auth', () => ({
  useAuthStore: () => ({
    isAdmin: true,
    logout: vi.fn(),
  }),
}));

describe('HomeView.vue', () => {
  let wrapper: ReturnType<typeof mount>;
  const mockGet = vi.fn();
  
  beforeEach(async () => {
    const axiosApi = await import('@/axios-api');
    axiosApi.default.get = mockGet;
    
    setActivePinia(createPinia());
    mockGet.mockResolvedValue({ data: [] }); // Начальное состояние: пустой массив пользователей
    wrapper = mount(HomeView);
    await flushPromises(); // Дождаться завершения всех промисов
  });

  it('должен отображать заголовок "Пользователи"', () => {
    expect(wrapper.find('h1').text()).toBe('Пользователи');
  });

  it('должен отображать кнопку "Добавить пользователя", если пользователь является администратором', () => {
    const button = wrapper.find('.btn.btn-primary');
    expect(button.exists()).toBe(true);
    expect(button.text()).toBe('Добавить пользователя');
  });

  
  it('должен отображать индикатор загрузки, пока данные загружаются', async () => {
    mockGet.mockImplementationOnce(() => new Promise(() => {})); // Мокаем задержку загрузки
    wrapper = mount(HomeView);
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.spinner-border').exists()).toBe(true);
  });


  it('должен отображать список пользователей, когда данные загружены', async () => {
    const users = [
      { id: 1, username: 'User1', email: 'user1@example.com', roles: ['admin'] },
      { id: 2, username: 'User2', email: 'user2@example.com', roles: ['user'] },
    ];
    mockGet.mockResolvedValueOnce({ data: users });
    wrapper = mount(HomeView);
    await flushPromises(); // Дождаться завершения всех промисов
    const rows = wrapper.findAll('tbody tr');
    expect(rows).toHaveLength(users.length); // Проверяем длину списка пользователей
    expect(rows[0].text()).toContain('User1');
    expect(rows[1].text()).toContain('User2');
  });

  it('должен отображать сообщение "Нет пользователей", если список пользователей пуст', async () => {
    mockGet.mockResolvedValueOnce({ data: [] });
    wrapper = mount(HomeView);
    await flushPromises(); // Дождаться завершения всех промисов
    expect(wrapper.find('tbody tr td').text()).toBe('Нет пользователей');
  });
});
