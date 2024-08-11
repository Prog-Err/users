import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { mount, flushPromises } from '@vue/test-utils';
import LoginView from '@/views/LoginView.vue';
import { useAuthStore } from '@/stores/auth';

// Мокаем store
vi.mock('@/stores/auth', () => ({
    useAuthStore: () => ({
        login: vi.fn(),
    }),
}));

describe('LoginView.vue', () => {
    let wrapper: ReturnType<typeof mount>;
    const mockLogin = vi.fn();
    
    beforeEach(async () => {
        setActivePinia(createPinia());
        const authStore = await import('@/stores/auth');
        authStore.useAuthStore = () => ({
            login: mockLogin,
        });

        wrapper = mount(LoginView, {
            global: {
                plugins: [],
            }
        });

        await flushPromises(); // Дождаться завершения всех промисов
    });

    it('должен отображать заголовок "Авторизация"', () => {
        expect(wrapper.find('h1').text()).toBe('Авторизация');
    });

    it('должен отображать ошибку, если имя пользователя не введено', async () => {
        await wrapper.find('input#username').setValue('');
        await wrapper.find('input#password').setValue('password');
        await wrapper.find('button').trigger('click');
        await flushPromises();
        expect(wrapper.find('.invalid-feedback').text()).toContain('Имя пользователя обязательно.');
    });

    it('должен отображать ошибку, если пароль не введен', async () => {
        await wrapper.find('input#username').setValue('username');
        await wrapper.find('input#password').setValue('');
        await wrapper.find('button').trigger('click');
        await flushPromises();
        expect(wrapper.find('.invalid-feedback').text()).toContain('Пароль обязателен.');
    });

    it('должен отображать ошибку при неправильном вводе данных', async () => {
        mockLogin.mockRejectedValue(new Error('Неверное имя пользователя или пароль'));
        await wrapper.find('input#username').setValue('wronguser');
        await wrapper.find('input#password').setValue('wrongpassword');
        await wrapper.find('button').trigger('click');

        // Дождитесь обновления Vue
        await flushPromises();
        const errorElement = wrapper.find('.text-danger');
        expect(errorElement.exists()).toBe(true);
        expect(errorElement.text()).toBe('Неверное имя пользователя или пароль');
    });

    it('должен отображать текст "Вход..." во время загрузки', async () => {
        mockLogin.mockImplementation(() => new Promise(() => { })); // Симуляция длительного запроса

        // Установите значения для полей формы и кликните на кнопку
        await wrapper.find('input#username').setValue('username');
        await wrapper.find('input#password').setValue('password');
        await wrapper.find('button').trigger('click');

        // Дождитесь обновления Vue
        await flushPromises();

        // Проверьте, что текст кнопки соответствует состоянию загрузки
        const button = wrapper.find('button');
        expect(button.text()).toBe('Вход...');
    });

});
