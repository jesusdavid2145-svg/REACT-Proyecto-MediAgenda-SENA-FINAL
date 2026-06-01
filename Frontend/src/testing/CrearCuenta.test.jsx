// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import CrearCuenta from '../pages/CrearCuenta';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useNavigate: () => mockNavigate };
});

global.fetch = vi.fn();

const renderCrearCuenta = () => render(
  <MemoryRouter initialEntries={['/']}>
    <CrearCuenta />
  </MemoryRouter>
);

const llenarFormulario = async () => {
  await userEvent.type(screen.getByPlaceholderText('Ingresa tus nombres'), 'Juan');
  await userEvent.type(screen.getByPlaceholderText('Ingresa tus apellidos'), 'Pérez');
  await userEvent.selectOptions(screen.getByRole('combobox'), 'cc');
  await userEvent.type(screen.getByPlaceholderText('Número de documento'), '123456');
  await userEvent.type(screen.getByPlaceholderText('ejemplo@correo.com'), 'juan@test.com');
  await userEvent.type(screen.getByPlaceholderText('300 000 0000'), '3001234567');
  await userEvent.type(screen.getByPlaceholderText('Crea una contraseña'), '123456');
  await userEvent.type(screen.getByPlaceholderText('Confirma tu contraseña'), '123456');
  await userEvent.click(screen.getByRole('checkbox'));
};

describe('Componente CrearCuenta - MediAgenda', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Renderizado del componente', () => {

    it('debe renderizar el botón principal Crear cuenta', () => {
      renderCrearCuenta();
      expect(screen.getByRole('button', { name: 'Crear cuenta' })).toBeInTheDocument();
    });

    it('debe renderizar el campo de nombres', () => {
      renderCrearCuenta();
      expect(screen.getByPlaceholderText('Ingresa tus nombres')).toBeInTheDocument();
    });

    it('debe renderizar el campo de apellidos', () => {
      renderCrearCuenta();
      expect(screen.getByPlaceholderText('Ingresa tus apellidos')).toBeInTheDocument();
    });

    it('debe renderizar el campo de número de documento', () => {
      renderCrearCuenta();
      expect(screen.getByPlaceholderText('Número de documento')).toBeInTheDocument();
    });

    it('debe renderizar el campo de correo', () => {
      renderCrearCuenta();
      expect(screen.getByPlaceholderText('ejemplo@correo.com')).toBeInTheDocument();
    });

    it('debe renderizar el campo de teléfono', () => {
      renderCrearCuenta();
      expect(screen.getByPlaceholderText('300 000 0000')).toBeInTheDocument();
    });

    it('debe renderizar el campo de contraseña', () => {
      renderCrearCuenta();
      expect(screen.getByPlaceholderText('Crea una contraseña')).toBeInTheDocument();
    });

    it('debe renderizar el campo de confirmar contraseña', () => {
      renderCrearCuenta();
      expect(screen.getByPlaceholderText('Confirma tu contraseña')).toBeInTheDocument();
    });

    it('debe renderizar el botón Crear cuenta', () => {
      renderCrearCuenta();
      expect(screen.getByRole('button', { name: /Crear cuenta/i })).toBeInTheDocument();
    });

    it('debe renderizar el botón Iniciar sesión', () => {
      renderCrearCuenta();
      expect(screen.getByRole('button', { name: /Iniciar sesión/i })).toBeInTheDocument();
    });

    it('debe renderizar el checkbox de términos', () => {
      renderCrearCuenta();
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('debe renderizar el enlace de términos y condiciones', () => {
      renderCrearCuenta();
      expect(screen.getByText('términos y condiciones')).toBeInTheDocument();
    });

  });

  describe('Interacciones del usuario', () => {

    it('debe actualizar el campo de nombres al escribir', async () => {
      renderCrearCuenta();
      const input = screen.getByPlaceholderText('Ingresa tus nombres');
      await userEvent.type(input, 'Juan');
      expect(input.value).toBe('Juan');
    });

    it('debe actualizar el campo de correo al escribir', async () => {
      renderCrearCuenta();
      const input = screen.getByPlaceholderText('ejemplo@correo.com');
      await userEvent.type(input, 'juan@test.com');
      expect(input.value).toBe('juan@test.com');
    });

    it('el campo contraseña debe ser tipo password por defecto', () => {
      renderCrearCuenta();
      expect(screen.getByPlaceholderText('Crea una contraseña').type).toBe('password');
    });

    it('debe marcar el checkbox de términos', async () => {
      renderCrearCuenta();
      const checkbox = screen.getByRole('checkbox');
      await userEvent.click(checkbox);
      expect(checkbox.checked).toBe(true);
    });

    it('debe abrir el modal de términos al hacer clic en el enlace', async () => {
      renderCrearCuenta();
      await userEvent.click(screen.getByText('términos y condiciones'));
      expect(screen.getByText('Aceptar y continuar')).toBeInTheDocument();
    });

    it('debe navegar a /login al hacer clic en Iniciar sesión', async () => {
      renderCrearCuenta();
      await userEvent.click(screen.getByRole('button', { name: /Iniciar sesión/i }));
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

  });

  describe('Validaciones del formulario', () => {

    it('debe mostrar alerta si los campos están vacíos', async () => {
      renderCrearCuenta();
      await userEvent.click(screen.getByRole('button', { name: /Crear cuenta/i }));
      expect(screen.getByText('Campos vacíos')).toBeInTheDocument();
    });

    it('debe mostrar alerta si las contraseñas no coinciden', async () => {
      renderCrearCuenta();
      await userEvent.type(screen.getByPlaceholderText('Ingresa tus nombres'), 'Juan');
      await userEvent.type(screen.getByPlaceholderText('Ingresa tus apellidos'), 'Pérez');
      await userEvent.selectOptions(screen.getByRole('combobox'), 'cc');
      await userEvent.type(screen.getByPlaceholderText('Número de documento'), '123456');
      await userEvent.type(screen.getByPlaceholderText('ejemplo@correo.com'), 'juan@test.com');
      await userEvent.type(screen.getByPlaceholderText('300 000 0000'), '3001234567');
      await userEvent.type(screen.getByPlaceholderText('Crea una contraseña'), '123456');
      await userEvent.type(screen.getByPlaceholderText('Confirma tu contraseña'), '654321');
      await userEvent.click(screen.getByRole('checkbox'));
      await userEvent.click(screen.getByRole('button', { name: /Crear cuenta/i }));
      expect(screen.getByText('Las contraseñas no coinciden')).toBeInTheDocument();
    });

    it('debe mostrar alerta si no acepta términos y condiciones', async () => {
      renderCrearCuenta();
      await userEvent.type(screen.getByPlaceholderText('Ingresa tus nombres'), 'Juan');
      await userEvent.type(screen.getByPlaceholderText('Ingresa tus apellidos'), 'Pérez');
      await userEvent.selectOptions(screen.getByRole('combobox'), 'cc');
      await userEvent.type(screen.getByPlaceholderText('Número de documento'), '123456');
      await userEvent.type(screen.getByPlaceholderText('ejemplo@correo.com'), 'juan@test.com');
      await userEvent.type(screen.getByPlaceholderText('300 000 0000'), '3001234567');
      await userEvent.type(screen.getByPlaceholderText('Crea una contraseña'), '123456');
      await userEvent.type(screen.getByPlaceholderText('Confirma tu contraseña'), '123456');
      await userEvent.click(screen.getByRole('button', { name: /Crear cuenta/i }));
      expect(screen.getByText('Términos no aceptados')).toBeInTheDocument();
    });

  });

  describe('Integración con el backend', () => {

    it('debe mostrar pantalla de éxito con registro correcto', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ mensaje: 'Usuario registrado correctamente.' }),
      });
      renderCrearCuenta();
      await llenarFormulario();
      await userEvent.click(screen.getByRole('button', { name: /Crear cuenta/i }));
      await waitFor(() => expect(screen.getByText('Registro exitoso')).toBeInTheDocument());
    });

    it('debe mostrar error si el correo ya está registrado', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'El correo ya está registrado.' }),
      });
      renderCrearCuenta();
      await llenarFormulario();
      await userEvent.click(screen.getByRole('button', { name: /Crear cuenta/i }));
      await waitFor(() => expect(screen.getByText('Correo ya registrado')).toBeInTheDocument());
    });

    it('debe llamar al endpoint correcto al registrarse', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ mensaje: 'Usuario registrado correctamente.' }),
      });
      renderCrearCuenta();
      await llenarFormulario();
      await userEvent.click(screen.getByRole('button', { name: /Crear cuenta/i }));
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          'http://localhost:3000/api/auth/registro',
          expect.objectContaining({ method: 'POST' })
        );
      });
    });

    it('debe mostrar error de conexión si el servidor no responde', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network Error'));
      renderCrearCuenta();
      await llenarFormulario();
      await userEvent.click(screen.getByRole('button', { name: /Crear cuenta/i }));
      await waitFor(() => expect(screen.getByText('Error de conexión')).toBeInTheDocument());
    });

  });

});