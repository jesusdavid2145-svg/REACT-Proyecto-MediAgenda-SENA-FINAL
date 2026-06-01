// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Login from '../pages/Login';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useNavigate: () => mockNavigate };
});

global.fetch = vi.fn();

const renderLogin = () => render(
  <MemoryRouter initialEntries={['/']}>
    <Login />
  </MemoryRouter>
);

describe('Componente Login - MediAgenda', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Renderizado del componente', () => {

    it('debe renderizar el título Iniciar sesión', () => {
      renderLogin();
      expect(screen.getByRole('heading', { name: 'Iniciar sesión' })).toBeInTheDocument();
    });

    it('debe renderizar el subtítulo', () => {
      renderLogin();
      expect(screen.getByText('Accede a tu cuenta para gestionar tus citas médicas')).toBeInTheDocument();
    });

    it('debe renderizar el logo MediAgenda', () => {
      renderLogin();
      expect(screen.getAllByText('MediAgenda').length).toBeGreaterThan(0);
    });

    it('debe renderizar el campo de correo', () => {
      renderLogin();
      expect(screen.getByPlaceholderText('ejemplo@correo.com')).toBeInTheDocument();
    });

    it('debe renderizar el campo de contraseña', () => {
      renderLogin();
      expect(screen.getByPlaceholderText('Ingresa tu contraseña')).toBeInTheDocument();
    });

    it('debe renderizar el botón Iniciar sesión', () => {
      renderLogin();
      expect(screen.getByRole('button', { name: /Iniciar sesión/i })).toBeInTheDocument();
    });

    it('debe renderizar el botón Crear cuenta', () => {
      renderLogin();
      expect(screen.getByRole('button', { name: /Crear cuenta/i })).toBeInTheDocument();
    });

    it('debe renderizar los tres tipos de acceso', () => {
      renderLogin();
      expect(screen.getByText('📧 Correo')).toBeInTheDocument();
      expect(screen.getByText('🪪 Documento')).toBeInTheDocument();
      expect(screen.getByText('📱 Teléfono')).toBeInTheDocument();
    });

    it('debe renderizar el checkbox Recordarme', () => {
      renderLogin();
      expect(screen.getByText('Recordarme')).toBeInTheDocument();
    });

    it('debe renderizar el enlace olvidaste tu contraseña', () => {
      renderLogin();
      expect(screen.getByText('¿Olvidaste tu contraseña?')).toBeInTheDocument();
    });

    it('debe renderizar el footer con copyright', () => {
      renderLogin();
      expect(screen.getByText(/MediAgenda © 2025/i)).toBeInTheDocument();
    });

  });

  describe('Interacciones del usuario', () => {

    it('debe actualizar el campo de correo al escribir', async () => {
      renderLogin();
      const input = screen.getByPlaceholderText('ejemplo@correo.com');
      await userEvent.type(input, 'test@correo.com');
      expect(input.value).toBe('test@correo.com');
    });

    it('debe actualizar el campo de contraseña al escribir', async () => {
      renderLogin();
      const input = screen.getByPlaceholderText('Ingresa tu contraseña');
      await userEvent.type(input, '1234');
      expect(input.value).toBe('1234');
    });

    it('el campo de contraseña debe ser tipo password por defecto', () => {
      renderLogin();
      expect(screen.getByPlaceholderText('Ingresa tu contraseña').type).toBe('password');
    });

    it('debe mostrar y ocultar contraseña al hacer clic en el ojo', async () => {
      renderLogin();
      const input  = screen.getByPlaceholderText('Ingresa tu contraseña');
      const eyeBtn = screen.getByLabelText('Mostrar contraseña');
      await userEvent.click(eyeBtn);
      expect(input.type).toBe('text');
      await userEvent.click(eyeBtn);
      expect(input.type).toBe('password');
    });

    it('debe cambiar placeholder al seleccionar tipo Documento', async () => {
      renderLogin();
      await userEvent.click(screen.getByText('🪪 Documento'));
      expect(screen.getByPlaceholderText('Número de documento')).toBeInTheDocument();
    });

    it('debe cambiar placeholder al seleccionar tipo Teléfono', async () => {
      renderLogin();
      await userEvent.click(screen.getByText('📱 Teléfono'));
      expect(screen.getByPlaceholderText('300 000 0000')).toBeInTheDocument();
    });

    it('debe marcar el checkbox Recordarme', async () => {
      renderLogin();
      const checkbox = screen.getByRole('checkbox');
      await userEvent.click(checkbox);
      expect(checkbox.checked).toBe(true);
    });

    it('debe abrir el modal de términos', async () => {
      renderLogin();
      await userEvent.click(screen.getAllByText(/términos y condiciones/i)[0]);
      expect(screen.getByText('Términos y condiciones de uso - MediAgenda')).toBeInTheDocument();
    });

    it('debe navegar a /registro al hacer clic en Crear cuenta', async () => {
      renderLogin();
      await userEvent.click(screen.getByRole('button', { name: /Crear cuenta/i }));
      expect(mockNavigate).toHaveBeenCalledWith('/registro');
    });

  });

  describe('Validaciones del formulario', () => {

    it('debe mostrar alerta si los campos están vacíos', async () => {
      renderLogin();
      await userEvent.click(screen.getByRole('button', { name: /Iniciar sesión/i }));
      expect(screen.getByText('Campos vacíos')).toBeInTheDocument();
    });

    it('debe mostrar mensaje de campos obligatorios', async () => {
      renderLogin();
      await userEvent.click(screen.getByRole('button', { name: /Iniciar sesión/i }));
      expect(screen.getByText('Todos los campos son obligatorios.')).toBeInTheDocument();
    });

    it('debe marcar el campo correo con error si está vacío', async () => {
      renderLogin();
      await userEvent.click(screen.getByRole('button', { name: /Iniciar sesión/i }));
      const wrap = screen.getByPlaceholderText('ejemplo@correo.com').closest('.input-wrap');
      expect(wrap).toHaveClass('error');
    });

    it('debe marcar el campo contraseña con error si está vacío', async () => {
      renderLogin();
      await userEvent.click(screen.getByRole('button', { name: /Iniciar sesión/i }));
      const wrap = screen.getByPlaceholderText('Ingresa tu contraseña').closest('.input-wrap');
      expect(wrap).toHaveClass('error');
    });

  });

  describe('Integración con el backend', () => {

    it('debe mostrar alerta de éxito con credenciales correctas', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          token: 'fake-token-123',
          usuario: { nombre: 'Juan', apellido: 'Pérez', correo: 'juan@test.com', rol: 'paciente' },
        }),
      });
      renderLogin();
      await userEvent.type(screen.getByPlaceholderText('ejemplo@correo.com'), 'juan@test.com');
      await userEvent.type(screen.getByPlaceholderText('Ingresa tu contraseña'), '1234');
      await userEvent.click(screen.getByRole('button', { name: /Iniciar sesión/i }));
      await waitFor(() => expect(screen.getByText('¡Bienvenido!')).toBeInTheDocument());
    });

    it('debe guardar el token en localStorage', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          token: 'fake-token-123',
          usuario: { nombre: 'Juan', apellido: 'Pérez', correo: 'juan@test.com', rol: 'paciente' },
        }),
      });
      renderLogin();
      await userEvent.type(screen.getByPlaceholderText('ejemplo@correo.com'), 'juan@test.com');
      await userEvent.type(screen.getByPlaceholderText('Ingresa tu contraseña'), '1234');
      await userEvent.click(screen.getByRole('button', { name: /Iniciar sesión/i }));
      await waitFor(() => expect(localStorage.getItem('token')).toBe('fake-token-123'));
    });

    it('debe mostrar error con credenciales incorrectas', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Correo o contraseña incorrectos.' }),
      });
      renderLogin();
      await userEvent.type(screen.getByPlaceholderText('ejemplo@correo.com'), 'wrong@test.com');
      await userEvent.type(screen.getByPlaceholderText('Ingresa tu contraseña'), 'wrongpass');
      await userEvent.click(screen.getByRole('button', { name: /Iniciar sesión/i }));
      await waitFor(() => expect(screen.getByText('Credenciales incorrectas')).toBeInTheDocument());
    });

    it('debe mostrar error de conexión si el servidor no responde', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network Error'));
      renderLogin();
      await userEvent.type(screen.getByPlaceholderText('ejemplo@correo.com'), 'test@test.com');
      await userEvent.type(screen.getByPlaceholderText('Ingresa tu contraseña'), '1234');
      await userEvent.click(screen.getByRole('button', { name: /Iniciar sesión/i }));
      await waitFor(() => expect(screen.getByText('Error de conexión')).toBeInTheDocument());
    });

    it('debe llamar al endpoint correcto', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          token: 'fake-token',
          usuario: { nombre: 'Juan', apellido: 'Pérez', correo: 'juan@test.com', rol: 'paciente' },
        }),
      });
      renderLogin();
      await userEvent.type(screen.getByPlaceholderText('ejemplo@correo.com'), 'juan@test.com');
      await userEvent.type(screen.getByPlaceholderText('Ingresa tu contraseña'), '1234');
      await userEvent.click(screen.getByRole('button', { name: /Iniciar sesión/i }));
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          'http://localhost:3000/api/auth/login',
          expect.objectContaining({ method: 'POST' })
        );
      });
    });

  });

});